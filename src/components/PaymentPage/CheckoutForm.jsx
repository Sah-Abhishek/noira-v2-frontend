import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { Apple, CreditCard, PoundSterling } from "lucide-react";
import useBookingStore from "../../store/bookingStore";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const { cart } = useBookingStore();
  const userjwt = localStorage.getItem("userjwt");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    // Call backend to create PaymentIntent
    const response = await axios.post(`${apiUrl}/create-checkout-session`, {
      cart // cents → $113.40
    }, {
      headers: {
        Authorization: `Bearer ${userjwt}`,

      }
    });

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      alert(error.message);
    } else if (paymentIntent.status === "succeeded") {
      alert("Payment successful!");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0d0d0d] text-white rounded-xl p-6 w-full max-w-md mx-auto border border-gray-800"
    >
      <h2 className="text-xl font-semibold mb-6 text-primary">Payment Information</h2>

      {/* Payment Methods */}
      <div className="space-y-3 mb-6">
        <button
          type="button"
          className="w-full flex items-center px-4 py-3 rounded-lg border border-gray-700 bg-[#0d0d0d] text-primary font-medium"
        >
          {/* <span className="mr-2"><CreditCard /></span> */}
          Credit/Debit Card
        </button>
        <button type="button" className="w-full flex items-center px-4 py-3 rounded-lg border border-gray-700 bg-[#0d0d0d] text-gray-300">
          {/* <span className="mr-2"><PoundSterling /></span> */}
          PayPal
        </button>
        <button type="button" className="w-full flex text-semibold items-center px-4 py-3 rounded-lg border border-gray-700 bg-[#0d0d0d text-gray-300">
          {/* <span className="mr-2"><Apple /></span> */}
          Apple Pay
        </button>
        <button type="button" className="w-full flex items-center px-4 py-3 rounded-lg border border-gray-700 bg-[#0d0d0d] text-gray-300">
          Google Pay
        </button>
      </div>

      {/* Cardholder Name */}
      <label className="block text-sm mb-2">Cardholder Name</label>
      <input
        type="text"
        placeholder="John Doe"
        className="w-full px-3 py-2 mb-4 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white"
      />

      {/* Stripe CardElement for card details */}
      <label className="block text-sm mb-2">Card Details</label>
      <div className="p-3 border border-gray-700 rounded-lg bg-gray-900 mb-4">
        <CardElement
          options={{
            style: {
              base: {
                color: "#0d0d0d",
                fontSize: "16px",
                "::placeholder": { color: "#9CA3AF" },
              },
              invalid: { color: "#EF4444" },
            },
          }}
        />
      </div>

      {/* Billing Address */}
      <label className="block text-sm mb-2">Billing Address</label>
      <input
        type="text"
        placeholder="Street Address"
        className="w-full px-3 py-2 mb-3 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white"
      />
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="City"
          className="w-1/2 px-3 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white"
        />
        <input
          type="text"
          placeholder="ZIP Code"
          className="w-1/2 px-3 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white"
        />
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2 mb-6 text-sm text-gray-400">
        <input type="checkbox" />
        <p>
          I agree to the{" "}
          <a href="#" className="text-primary underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 rounded-lg font-semibold text-black bg-primary"
      >
        {loading ? "Processing..." : "Confirm Booking & Pay $113.40"}
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        🔒 Your payment information is encrypted and secure
      </p>
    </form>
  );
};

export default CheckoutForm;
