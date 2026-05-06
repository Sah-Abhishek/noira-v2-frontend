import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import axios from "axios";
import useBookingStore from "../../store/bookingStore";

const BookingSummary = ({ setCouponCode }) => {
  const selectedTherapist = useBookingStore((state) => state.selectedTherapist);
  const date = useBookingStore((state) => state.date);
  const time = useBookingStore((state) => state.time);
  const { cart, userAddress } = useBookingStore();

  const [coupon, setCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountFixed, setDiscountFixed] = useState(0);
  const [discountType, setDiscountType] = useState(null); // "percentage" | "fixed" | "free"
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [error, setError] = useState("");
  const [validating, setValidating] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  if (!selectedTherapist) {
    return (
      <div className="bg-[#0d0d0d] rounded-2xl p-6 border border-white/10 text-white">
        No therapist selected.
      </div>
    );
  }

  // ✅ Safe destructuring with fallbacks
  const avatar =
    selectedTherapist?.avatar_url ||
    selectedTherapist?.userId?.avatar_url ||
    "https://www.citypng.com/public/uploads/preview/white-user-member-guest-icon-png-image-701751695037005zdurfaim0y.png?v=2025073005";
  const email =
    selectedTherapist.email || selectedTherapist?.userId?.email || "N/A";
  const {
    title = "Therapist",
    rating = 0,
    experience = 0,
  } = selectedTherapist.profile || selectedTherapist || {};

  // Extract cart details safely
  const serviceName = cart?.serviceName || "Not selected";
  const serviceDuration = cart?.durationMinutes
    ? `${cart.durationMinutes} minutes`
    : "Not selected";
  const serviceFee = cart?.price || 0;

  // ✅ Elite Hours Logic
  let eliteHoursFee = 0;
  if (time) {
    const [hourStr] = time.split(":"); // "HH:mm"
    const hour = parseInt(hourStr, 10);

    // Elite hours = 23:00 → 23:59 OR 00:00 → 09:00
    if (hour >= 23 || hour < 9) {
      eliteHoursFee = 15;
    }
  }


  // ✅ Coupon Logic — validates against backend
  const handleApplyCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    if (!code) {
      setError("Please enter a coupon code");
      return;
    }

    setValidating(true);
    setError("");
    try {
      const res = await axios.post(`${apiUrl}/coupon/validate`, {
        code,
        amount: serviceFee + eliteHoursFee,
      });

      const { type, value, discount } = res.data.coupon;
      setDiscountType(type);
      setAppliedCoupon(code);
      setCouponCode(code);

      if (type === "percentage") {
        setDiscountPercent(value);
        setDiscountFixed(0);
      } else if (type === "fixed") {
        setDiscountPercent(0);
        setDiscountFixed(value);
      } else if (type === "free") {
        setDiscountPercent(100);
        setDiscountFixed(0);
      }
    } catch (err) {
      setDiscountPercent(0);
      setDiscountFixed(0);
      setDiscountType(null);
      setAppliedCoupon(null);
      setCouponCode(null);
      setError(err.response?.data?.message || "Invalid coupon code");
    } finally {
      setValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon("");
    setDiscountPercent(0);
    setDiscountFixed(0);
    setDiscountType(null);
    setAppliedCoupon(null);
    setCouponCode(null);
    setError("");
  };

  const subtotal = serviceFee + eliteHoursFee;
  let discountAmount = 0;
  if (discountType === "percentage" || discountType === "free") {
    discountAmount = (subtotal * discountPercent) / 100;
  } else if (discountType === "fixed") {
    discountAmount = Math.min(discountFixed, subtotal);
  }
  const total = Math.max(subtotal - discountAmount, 0);

  return (
    <div className="bg-[#0d0d0d] rounded-2xl p-6 border border-white/10 shadow-lg w-full space-y-6">
      {/* Heading */}
      <h2 className="text-primary text-lg font-semibold mb-6">
        Booking Summary
      </h2>

      {/* Therapist Info */}
      <div className="bg-[#111] rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={email}
            className="w-14 h-14 rounded-full object-cover border-2 border-primary"
          />
          <div>
            <h3 className="text-white font-semibold">{title}</h3>
            <p className="text-primary text-xs">{experience} years experience</p>
            <div className="flex items-center gap-1 mt-1">
              {/* <div className="flex"> */}
              {/*   {[1, 2, 3, 4, 5].map((star) => ( */}
              {/*     <Star */}
              {/*       key={star} */}
              {/*       className={`w-3 h-3 ${star <= Math.round(rating) */}
              {/*         ? "text-primary fill-primary" */}
              {/*         : "text-gray-600" */}
              {/*         }`} */}
              {/*     /> */}
              {/*   ))} */}
              {/* </div> */}
              {/* <span className="text-gray-300 text-xs ml-1">{rating}</span> */}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Info */}
      <div className="bg-[#111] rounded-2xl p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Date:</span>
          <span className="text-white text-sm">
            {date
              ? new Date(date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
              : "Not selected"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Time:</span>
          <span className="text-white text-sm">{time || "Not selected"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Service:</span>
          <span className="text-white text-sm">{serviceName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Duration:</span>
          <span className="text-white text-sm">{serviceDuration}</span>
        </div>
      </div>

      {/* User Address */}
      {userAddress && (
        <div className="bg-[#111] rounded-2xl p-4 space-y-2">
          <h3 className="text-primary font-semibold text-sm mb-2">
            Your Address
          </h3>
          <div className="text-white text-sm leading-relaxed">
            {[
              [userAddress?.building_No, userAddress?.Street]
                .filter(Boolean)
                .join(", "),
              [userAddress?.Locality, userAddress?.PostTown]
                .filter(Boolean)
                .join(", "),
              userAddress?.PostalCode,
            ]
              .filter(Boolean)
              .map((line, i) => (
                <p key={i}>{line}</p>
              ))}
          </div>
        </div>
      )}

      {/* Coupon Section */}
      <div className="bg-[#111] rounded-2xl p-4 space-y-3">
        <h3 className="text-primary font-semibold text-sm">Add Coupon</h3>
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
            <span className="text-green-400 text-sm">
              <strong>{appliedCoupon}</strong> applied
              {discountType === "percentage" && ` — ${discountPercent}% off`}
              {discountType === "fixed" && ` — £${discountFixed} off`}
              {discountType === "free" && " — Free!"}
            </span>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-400 text-xs hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:outline-none focus:border-primary uppercase"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={validating}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-primary text-black font-semibold text-sm hover:opacity-90 disabled:opacity-50"
            >
              {validating ? "Checking..." : "Apply"}
            </button>
          </div>
        )}
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>

      {/* Pricing */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Service Fee:</span>
          <span className="text-white">₤{serviceFee.toFixed(2)}</span>
        </div>
        {eliteHoursFee > 0 && (
          <div className="flex justify-between text-sm text-yellow-400">
            <span>Elite Hours Fee:</span>
            <span>₤{eliteHoursFee.toFixed(2)}</span>
          </div>
        )}
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-400">
            <span>
              Discount
              {discountType === "percentage" && ` (${discountPercent}%)`}
              {discountType === "fixed" && ` (£${discountFixed})`}
              {discountType === "free" && " (Free)"}
              :
            </span>
            <span>-£{discountAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-white/10 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-primary text-lg font-semibold">Total:</span>
          <span className="text-primary text-xl font-bold">
            ₤ {total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
