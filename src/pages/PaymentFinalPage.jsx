import React, { useEffect, useState } from "react";
import { ArrowLeft, Lock, Loader2 } from "lucide-react";
import BookingSummary from "../components/PaymentPage/BookingSummary.jsx";
import BookingStepper from "../components/ServicesPage/BookingStepper.jsx";

import useBookingStore from "../store/bookingStore.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import AddressModal from "../components/Modals/AddressModal.jsx";
import SavedAddresses from "../components/PaymentPage/SavedAddresses.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import useUserStore from "../store/UserStore.jsx";
import VerifyMobileModal from "../components/user/VerifyMobileModal.jsx";
import EmailPhoneAndLoginModal from "../components/PaymentPage/EmailPhoneAndLoginModal.jsx";

const PaymentPage = () => {
  const { userAddress, cart, date, time, selectedTherapist } = useBookingStore();
  const { user } = useUserStore();
  const [modalEmail, setModalEmail] = useState('');
  const [modalMobileNumber, setModalMobileNumber] = useState('');
  const [isGuestPaymentModalOpen, setIsGuestPaymentModalOpen] = useState(false);

  const [lengthOfReturnedAddresses, setLengthOfReturnedAddresses] = useState(0);
  const [isVerifyMobileModalOpen, setIsVerifyMobileModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [couponCode, setCouponCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";
  const userjwt = localStorage.getItem("userjwt");
  const apiUrl = import.meta.env.VITE_API_URL;
  const userEmail = localStorage.getItem("userEmail");
  console.log("This is the value of the modalOpen: ", isGuestPaymentModalOpen);

  // useEffect(() => {
  //   setIsGuestPaymentModalOpen(false);
  // })

  const handlePayment = async (modalEmail, modalMobileNumber) => {
    if (!userjwt) {
      setIsGuestPaymentModalOpen(true);
      return
    }

    if (loading) return;
    setLoading(true);

    if (!user?.phoneVerified) {
      // toast.error("Verify Phone in the profile section");
      setIsVerifyMobileModalOpen(true);
      setLoading(false);
      return;
    }

    try {
      if (lengthOfReturnedAddresses === 0) {
        setIsAddressModalOpen(true);
        setLoading(false);
        return;
      }
      if (userAddress) {
        const res = await axios.post(
          `${apiUrl}/payment/create-checkout-session`,
          {
            email: userEmail || modalEmail,
            therapistId: selectedTherapist._id,
            serviceId: cart.serviceId,
            optionIndex: cart.optionIndex,
            mobileNumber: modalMobileNumber,
            date,
            time,
            couponCode,
          },
          { headers: { Authorization: `Bearer ${userjwt}` } }
        );

        if (res.data.url) {
          window.location.href = res.data.url;
        }
      } else {
        toast.error("Select an address for the booking");
        setLoading(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handlePayByCash = async () => {
    if (!userjwt) {
      setIsGuestPaymentModalOpen(true);
      return
    }

    if (loading) return;
    setLoading(true);

    if (!user?.phoneVerified) {
      // toast.error("Verify Phone in the profile section");
      setIsVerifyMobileModalOpen(true);
      setLoading(false);
      return;
    }

    try {
      if (lengthOfReturnedAddresses === 0) {
        setIsAddressModalOpen(true);
        setLoading(false);
        return;
      }
      if (userAddress) {
        const res = await axios.post(
          `${apiUrl}/payment/cashBooking`,
          {
            email: userEmail,
            therapistId: selectedTherapist._id,
            serviceId: cart.serviceId,
            optionIndex: cart.optionIndex,
            date,
            time,
            couponCode,
          },
          { headers: { Authorization: `Bearer ${userjwt}` } }
        );

        if (res.status === 200) {
          navigate("/user/mybookings");
          setLoading(false);
        }
      } else {
        toast.error("Select an address for the booking");
        setLoading(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-20 pt-10 px-4">
      <div className="max-w-6xl pt-5 mx-auto">
        <BookingStepper className="mt-10" currentStep={3} />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-primary text-4xl font-bold mb-2">Payment</h1>
          <p className="text-gray-400 text-lg">Securely complete your booking</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Lock className="w-4 h-4 text-green-500" />
            <span className="text-green-500 text-sm">
              Secure SSL-encrypted payment
            </span>
          </div>
        </div>

        {/* Two Column Layout */}
        {userjwt ? (
          // Authenticated user: two-column layout
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booking Summary */}
            <div className="bg-[#0d0d0d] p-6 rounded-2xl flex flex-col h-full">
              <BookingSummary setCouponCode={setCouponCode} />
            </div>

            {/* Saved Addresses */}
            <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-primary/20 flex flex-col h-full">
              <SavedAddresses
                refreshKey={refreshKey}
                setLengthOfReturnedAddresses={setLengthOfReturnedAddresses}
              />
            </div>
          </div>
        ) : (
          // Guest user: single column layout
          <div className="max-w-xl mx-auto">
            <div className="bg-[#0d0d0d] p-6 rounded-2xl flex flex-col h-full">
              <BookingSummary setCouponCode={setCouponCode} />
            </div>
          </div>
        )}
        {/* Payment Buttons */}
        <div className="mt-12 max-w-lg mx-auto text-center space-y-5">
          <button
            onClick={() => navigate(from)}
            disabled={loading}
            className="w-full bg-black border border-primary text-primary hover:text-black font-semibold py-3 px-6 rounded-full hover:bg-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to therapist
          </button>

          {userjwt ? (
            <>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-primary text-black font-semibold py-3 px-6 rounded-full transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Confirm and Pay
                  </>
                )}
              </button>

              <button
                onClick={handlePayByCash}
                disabled={loading}
                className="w-full bg-primary text-black font-semibold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pay by Cash
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsGuestPaymentModalOpen(true)}
              disabled={loading}
              className="w-full bg-primary text-black font-semibold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setRefreshKey((prev) => prev + 1); // ✅ force re-fetch in SavedAddresses
        }}
      />
      <VerifyMobileModal
        isOpen={isVerifyMobileModalOpen}
        onClose={() => setIsVerifyMobileModalOpen(false)}
      />
      <EmailPhoneAndLoginModal
        setMobileNumber={setModalMobileNumber}
        setEmail={setModalEmail}
        isOpen={isGuestPaymentModalOpen}
        onConformCash={handlePayByCash}
        onClose={() => setIsGuestPaymentModalOpen(false)}
        onConfirmOnline={handlePayment}
        couponCode={couponCode}
        setIsGuestPaymentModalOpen={setIsGuestPaymentModalOpen}
      />

    </div >
  );
};

export default PaymentPage;
