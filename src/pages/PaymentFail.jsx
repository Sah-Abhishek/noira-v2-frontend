
import React from "react";
import { XCircle } from "lucide-react";

const PaymentFail = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Fail Icon */}
        <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-600/40">
          <XCircle className="w-12 h-12 text-white" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#FFD700] mb-2">Payment Failed</h1>
        <p className="text-gray-400 mb-6">Something went wrong with your payment. Please try again.</p>

        {/* Button */}
        <a
          href="/payment"
          className="inline-block bg-[#FFD700] text-black font-semibold py-3 px-6 rounded-full hover:opacity-90 transition"
        >
          Try Again
        </a>
      </div>
    </div>
  );
};

export default PaymentFail;
