// src/components/StickyCartSummary.jsx
import React, { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useBookingStore from "../../store/bookingStore.jsx";

export default function StickyCartSummary({ isAbled, setIsAbled }) {
  const { cart, selectedTherapist } = useBookingStore();
  const location = useLocation();
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const prevBodyPaddingRef = useRef("");

  // If nothing is in cart, don't render anything
  if (!cart || !cart.serviceId) return null;

  // Measure and set body padding to the height of this component so content never sits under it.
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // save previous padding so we can restore it on cleanup
    prevBodyPaddingRef.current = document.body.style.paddingBottom || "";

    const updatePadding = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      // set body padding-bottom so page content scroll area is above the fixed footer
      document.body.style.paddingBottom = `${height}px`;
    };

    // initial
    updatePadding();

    // use ResizeObserver for robust resizes (content change / responsive)
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(updatePadding);
      ro.observe(el);
    } else {
      // fallback
      window.addEventListener("resize", updatePadding);
    }

    // cleanup: restore previous body padding and remove listeners
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", updatePadding);
      document.body.style.paddingBottom = prevBodyPaddingRef.current;
    };
    // re-run when key inputs that can change height change
  }, [cart?.serviceId, isAbled, selectedTherapist?.profile?._id]);

  const handleContinue = () => {
    if (location.pathname === "/allservicespage") {
      navigate("/choosetherapist");
    } else if (location.pathname === "/choosetherapist") {
      navigate("/paymentpage", { state: { from: "/choosetherapist" } });
    } else if (location.pathname === "/servicesbytherapist") {
      navigate("/findtherapistbyavailability");
    } else if (location.pathname === "/findtherapistbyavailability") {
      navigate("/paymentpage", { state: { from: "/findtherapistbyavailability" } });
    }
  };

  return (
    <div
      ref={rootRef}
      className="fixed bottom-0 left-0 w-full bg-black border-t border-primary/30 
                 px-4 py-4 sm:px-8 sm:py-6 md:px-20 lg:px-40 flex flex-col md:flex-row 
                 items-center justify-between gap-4 z-50
                 transform transition-all duration-500 ease-in-out"
    >
      {/* Cart Info */}
      <div className="w-full md:w-auto text-center md:text-left">
        <div className="text-sm text-noira-light">
          <span className="mr-2 text-lg sm:text-xl text-primary font-bold">Selected:</span>
          <span className="font-semibold text-white">{cart.serviceName}</span>
          <span className="mx-2 text-noira-gold hidden sm:inline">•</span>
          <span className="font-semibold text-white block sm:inline">£{cart?.price ?? 0}</span>
          <span className="mx-2 text-noira-gold hidden sm:inline">•</span>
          <span className="text-gray-400 text-sm block sm:inline">
            {cart.durationMinutes} min
          </span>
        </div>

        {selectedTherapist && (
          <div className="mt-2 sm:mt-1">
            <span className="mr-2 text-lg sm:text-xl text-primary font-bold">Therapist:</span>
            <span className="font-semibold text-white">
              {selectedTherapist.profile?.title || selectedTherapist?.title}
            </span>
          </div>
        )}
      </div>

      {/* Continue Button */}
      <button
        className={`w-full md:w-auto px-6 py-3 rounded-full shadow-lg font-semibold transition text-center
          ${isAbled
            ? "bg-primary text-black hover:bg-primary/90 cursor-pointer"
            : "bg-gray-600 text-gray-300 cursor-not-allowed opacity-50"
          }`}
        disabled={!isAbled}
        onClick={handleContinue}
      >
        {location.pathname === "/choosetherapist" ||
          location.pathname === "/findtherapistbyavailability"
          ? "Continue to Payment Page"
          : "Continue to Date & Time"}
      </button>
    </div>
  );
}
