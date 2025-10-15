import React, { useState } from "react";
import { X } from "lucide-react";
import useBookingStore from "../../store/bookingStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AuthModal({
  isOpen,
  onClose,
  onConfirmCash,
  onConfirmOnline,
  setMobileNumber,
  setEmail,
  couponCode,
  setIsGuestPaymentModalOpen,
}) {
  const [name, setName] = useState("");
  const [email, setEmailLocal] = useState("");
  const [mobile, setMobileLocal] = useState("");
  const [errors, setErrors] = useState({});
  const apiUrl = import.meta.env.VITE_API_URL;
  const {
    userAddress,
    userName,
    setCouponCode,
    setUserName,
    setUserPhoneNumber,
    setUserEmail,
    cart,
    date,
    time,
    selectedTherapist,
  } = useBookingStore();
  const navigate = useNavigate();
  const postalCode = sessionStorage.getItem('postalCode');


  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email.";
    }
    if (!mobile) {
      newErrors.mobile = "Phone number is required.";
    } else if (mobile.length !== 10) {
      newErrors.mobile = "Phone number must be exactly 10 digits.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async (method) => {
    if (!validate()) return;

    setEmail?.(email);
    setMobileNumber?.(mobile);

    if (method === "cash") {
      setUserEmail(email);
      setUserPhoneNumber(mobile);
      setCouponCode(couponCode);
      setUserName(name);

      navigate("/bookingconfirmedbycash");
    } else if (method === "online") {
      const res = await axios.post(`${apiUrl}/payment/create-checkout-session`, {
        name,
        email,
        therapistId: selectedTherapist._id,
        serviceId: cart.serviceId,
        optionIndex: cart.optionIndex,
        mobileNumber: mobile,
        date,
        time,
        couponCode,
        PostalCode: postalCode
      });
      setIsGuestPaymentModalOpen(false);

      if (res.data.url) {
        window.location.href = res.data.url;
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0d0d]/80 backdrop-blur-sm">
      <div className="relative bg-[#111] rounded-2xl shadow-xl w-full max-w-md p-6 text-white">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          Guest Login
        </h2>

        {/* Input fields */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#0d0d0d] text-white border border-primary/40 focus:outline-none focus:border-primary"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmailLocal(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#0d0d0d] text-white border border-primary/40 focus:outline-none focus:border-primary"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone input with +44 */}
          <div>
            <div className="flex items-center rounded-lg border border-primary/40 bg-[#0d0d0d]">
              <div className="px-3 py-3 text-gray-300 border-r border-primary/40 select-none">
                +44
              </div>
              <input
                type="tel"
                placeholder="Enter 10 digit mobile number"
                value={mobile}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, ""); // digits only
                  setMobileLocal(val);
                }}
                className="flex-1 px-4 py-3 bg-transparent text-white focus:outline-none"
              />
            </div>
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>
        </div>

        {/* Payment buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => handleConfirm("online")}
            className="flex-1 py-3 rounded-lg font-semibold bg-primary text-black hover:scale-105 transition-transform"
          >
            Pay Online
          </button>
          <button
            onClick={() => handleConfirm("cash")}
            className="flex-1 py-3 rounded-lg font-semibold bg-primary text-black hover:scale-105 transition-transform"
          >
            Pay by Cash
          </button>
        </div>

        {/* Divider with OR */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-white/20"></div>
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="flex-grow h-px bg-white/20"></div>
        </div>

        {/* Login + Signup buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/userlogin")}
            className="flex-1 py-3 rounded-lg font-semibold border border-primary text-primary hover:bg-primary hover:text-black transition-colors"
          >
            Login
          </button>
          {/* <button */}
          {/*   onClick={() => navigate("/usersignup")} */}
          {/*   className="flex-1 py-3 rounded-lg font-semibold border border-primary text-primary hover:bg-primary hover:text-black transition-colors" */}
          {/* > */}
          {/*   Signup */}
          {/* </button> */}
        </div>
      </div>
    </div>
  );
}
