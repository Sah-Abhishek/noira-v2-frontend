
import React, { useState } from "react";
import noira from "/noira.png";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.post(`${apiUrl}/auth/forgot-password`, { email }, {
      });
      toast.success(res.data.message || "Password reset link sent to your email!");
      navigate("/userlogin"); // after request, redirect to login
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong. Try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#1a1a1a] rounded-xl shadow-lg p-8 space-y-6 relative border border-primary">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img src={noira} alt="Logo" className="h-12 sm:h-14 mb-3" />
          <p className="text-primary font-medium">Wellness Platform</p>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-primary">
          Forgot Password
        </h2>
        <p className="text-gray-400 text-center text-sm">
          Enter your email and we’ll send you a reset link
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-300 flex items-center gap-2 mb-1">
              <FaEnvelope className="text-primary" />
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              : "bg-primary text-black hover:bg-amber-400"
              }`}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to login */}
        <div className="text-center mt-4">
          <Link
            to="/userlogin"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <FaArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
