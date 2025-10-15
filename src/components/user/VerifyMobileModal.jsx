import { useState, useEffect } from "react";
import axios from "axios";
import useUserStore from "../../store/UserStore";
import { X } from "lucide-react";

function VerifyMobileModal({ isOpen, onClose, }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0); // ⏳ countdown state
  const [phoneNumber, setPhoneNumber] = useState(""); // local phone number state
  const [isEditingPhone, setIsEditingPhone] = useState(false); // to toggle phone editing

  const { user, setUser } = useUserStore();
  const apiUrl = import.meta.env.VITE_API_URL;
  const userjwt = localStorage.getItem('userjwt');

  // Initialize phone number from user store
  useEffect(() => {
    if (user?.phone) {
      setPhoneNumber(user.phone);
    }
  }, [user?.phone]);

  // countdown effect
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setMessage("");
      setOtpSent(false);
      setResendTimer(0);
      setIsEditingPhone(!user?.phone); // Auto-enable editing if no phone number
    }
  }, [isOpen, user?.phone]);

  // Validation for phone number (basic 10-digit validation)
  const isValidPhoneNumber = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      setMessage("Please enter your phone number.");
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await axios.post(
        `${apiUrl}/otp/send-otp`,
        { mobileNumber: `44${phoneNumber}` },
        { headers: { Authorization: `Bearer ${userjwt}` } }
      );
      setOtpSent(true);
      setIsEditingPhone(false); // Hide phone editing once OTP is sent
      setOtp(""); // clear any old OTP
      setResendTimer(120); // start 2-minute countdown
      setMessage("OTP sent to your mobile number.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp) {
      setMessage("Please enter OTP");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        `${apiUrl}/otp/verify-otp`,
        { otp, mobileNumber: `44${phoneNumber}`, userId: user._id },
        { headers: { Authorization: `Bearer ${userjwt}` } }
      );
      if (response?.data?.type === "success") {
        setUser(response.data.user);
        setMessage("Phone number verified successfully!");
        setOtp("");
        setOtpSent(false);
        setTimeout(() => {
          onClose();
        }, 1500); // Close modal after showing success message
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePhone = () => {
    setIsEditingPhone(true);
    setOtpSent(false);
    setOtp("");
    setResendTimer(0);
    setMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111] border border-gray-700 rounded-xl p-6 w-full max-w-md relative shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-semibold text-gray-200 mb-4">
          Verify Mobile Number
        </h3>

        {/* Phone Number Input Section */}
        {(!user?.phone || isEditingPhone || !otpSent) && (
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">
              Mobile Number
            </label>
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-400 bg-gray-700 px-3 py-2 rounded-l-lg border-r border-gray-600">
                +44
              </span>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                  if (value.length <= 10) {
                    setPhoneNumber(value);
                  }
                }}
                disabled={otpSent && !isEditingPhone}
                className="flex-1 text-white bg-[#0d0d0d] border border-gray-600 text-sm rounded-r-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                maxLength="10"
              />
            </div>

            {/* Show current phone number if exists and not editing */}
            {user?.phone && !isEditingPhone && otpSent && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">
                  OTP sent to: +44 {user.phone}
                </span>
                <button
                  onClick={handleChangePhone}
                  className="text-xs text-primary hover:text-amber-500 underline"
                >
                  Change Number
                </button>
              </div>
            )}
          </div>
        )}

        {/* OTP Section */}
        {!otpSent ? (
          <button
            onClick={handleSendOtp}
            disabled={loading || !phoneNumber}
            className="w-full bg-primary text-black text-sm font-semibold py-2 rounded-lg hover:bg-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          !isEditingPhone && (
            <>
              <div className="mb-3">
                <label className="block text-sm text-gray-300 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                    if (value.length <= 6) {
                      setOtp(value);
                    }
                  }}
                  className="w-full text-white bg-[#0d0d0d] border border-gray-600 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  maxLength="6"
                />
              </div>

              <button
                onClick={handleVerify}
                disabled={loading || otp.length !== 6}
                className="w-full bg-primary text-black text-sm font-semibold py-2 rounded-lg hover:bg-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed mb-2"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              {/* Resend OTP and Change Number buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleSendOtp}
                  disabled={resendTimer > 0 || loading}
                  className={`flex-1 ${resendTimer > 0
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-primary hover:bg-amber-500"
                    } text-black text-sm font-semibold py-2 rounded-lg transition`}
                >
                  {resendTimer > 0
                    ? `Resend in ${Math.floor(resendTimer / 60)}:${(
                      resendTimer % 60
                    )
                      .toString()
                      .padStart(2, "0")}`
                    : "Resend OTP"}
                </button>

                <button
                  onClick={handleChangePhone}
                  className="px-4 bg-gray-700 text-gray-300 text-sm font-semibold py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Change
                </button>
              </div>
            </>
          )
        )}

        {message && (
          <p className={`text-xs mt-3 ${message.includes("successfully") || message.includes("sent")
            ? "text-green-400"
            : "text-yellow-400"
            }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default VerifyMobileModal;
