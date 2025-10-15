import React, { useState } from "react";
import { CheckCircle2, Save } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useBookingStore from "../store/bookingStore";

const BookingConfirmed = () => {
  const [buildingNo, setBuildingNo] = useState("");
  const [street, setStreet] = useState("");
  const [locality, setLocality] = useState("");
  const [postTown, setPostTown] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Prefill from session storage
  const sessionPostalCode = sessionStorage.getItem("postalCode") || "";

  const {
    setUserAddress,
    userEmail,
    couponCode,
    cart,
    date,
    time,
    selectedTherapist,
    userPhoneNumber,
    userName,
  } = useBookingStore();

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleSaveAddress = async () => {
    if (!buildingNo || !street || !locality || !postTown || !sessionPostalCode) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const addressObj = {
        Building_No: buildingNo,
        Street: street,
        Locality: locality,
        PostTown: postTown,
        PostalCode: sessionPostalCode,
      };

      // ✅ Store in Zustand store
      setUserAddress(addressObj);

      // ✅ Save and trigger booking
      const res = await axios.post(`${apiUrl}/payment/cashBooking`, {
        email: userEmail,
        therapistId: selectedTherapist._id,
        serviceId: cart.serviceId,
        optionIndex: cart.optionIndex,
        date,
        time,
        couponCode,
        name: userName,
        phone: userPhoneNumber,
        address: addressObj,
      });

      if (res.status === 200) {
        toast.success("Check Mail for login details");
        navigate("/user/mybookings");
      }
    } catch (err) {
      console.error("Error saving address:", err);
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="bg-[#111] rounded-2xl shadow-xl w-full max-w-lg p-8 text-white relative">
        {/* ✅ Booking confirmed heading */}
        <div className="text-center mb-10">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary">
            Your booking is confirmed 🎉
          </h1>
          <p className="text-gray-400 mt-2">
            Where should the therapist come? Please enter your address below.
          </p>
        </div>

        {/* ✅ Address form */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Building No"
            value={buildingNo}
            onChange={(e) => setBuildingNo(e.target.value)}
            className="col-span-1 px-4 py-3 rounded-lg bg-[#0d0d0d] border border-primary/40 text-white focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="col-span-1 px-4 py-3 rounded-lg bg-[#0d0d0d] border border-primary/40 text-white focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Locality"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="col-span-1 px-4 py-3 rounded-lg bg-[#0d0d0d] border border-primary/40 text-white focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Post Town"
            value={postTown}
            onChange={(e) => setPostTown(e.target.value)}
            className="col-span-1 px-4 py-3 rounded-lg bg-[#0d0d0d] border border-primary/40 text-white focus:outline-none focus:border-primary"
          />

          {/* ✅ Postal Code (Prefilled & Disabled) */}
          <div className="col-span-2 relative">
            <input
              type="text"
              placeholder="Postal Code"
              value={sessionPostalCode}
              disabled
              className="w-full px-4 py-3 rounded-lg bg-[#0d0d0d] border border-primary/40 text-white cursor-not-allowed opacity-70"
            />
          </div>
        </div>

        {/* ✅ Confirm button */}
        <button
          onClick={handleSaveAddress}
          disabled={loading}
          className="mt-8 w-full py-3 rounded-lg font-semibold bg-primary text-black hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {loading ? "Saving..." : "Confirm Address"}
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmed;
