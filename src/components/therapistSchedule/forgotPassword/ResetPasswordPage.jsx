
import React, { useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import noira from "/noira-london-vip.png";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useParams();  // <-- works with /auth/resetpassword/:token
  // console.log("This is the token: ", token);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(`${apiUrl}/auth/reset-password`, {
        token,
        newPassword,
      });

      toast.success(res.data.message || "Password reset successful!");
      navigate("/userlogin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed, try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#1a1a1a] rounded-xl shadow-lg p-8 space-y-6 relative border border-primary/20">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img src={noira} alt="Logo" className="h-12 sm:h-14 mb-3" />
          <p className="text-primary font-medium">Wellness Platform</p>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-primary">
          Reset Password
        </h2>
        <p className="text-gray-400 text-center text-sm">
          Enter your new password below
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label className="text-sm text-gray-300 flex items-center gap-2 mb-1">
              <FaLock className="text-primary" />
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-[#2b2b2b] text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm text-gray-300 flex items-center gap-2 mb-1">
              <FaLock className="text-primary" />
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-[#2b2b2b] text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-md font-semibold transition flex items-center justify-center ${isLoading
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-primary text-black hover:bg-amber-500"
              }`}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
