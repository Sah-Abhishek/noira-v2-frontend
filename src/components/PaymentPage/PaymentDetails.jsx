import React, { useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";

const PaymentDetails = ({ onPayment, onBack }) => {
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    saveCard: false
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Safely serialize formData in case it contains objects like Date
      const safeFormData = JSON.parse(JSON.stringify(formData));

      const response = await fetch('/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(safeFormData)
      });

      if (response.ok) {
        onPayment(safeFormData);
      } else {
        console.error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#FFD700] rounded-lg p-6 border border-gray-700">
      <h2 className="text-white text-xl font-semibold mb-6">Payment Details</h2>

      {/* Payment Method Icons */}
      <div className="flex gap-3 mb-6">
        {['VISA', 'MC', 'AMEX'].map((label, index) => (
          <div
            key={index}
            className={`w-12 h-8 rounded flex items-center justify-center ${label === 'VISA' ? 'bg-blue-600' : label === 'MC' ? 'bg-red-600' : 'bg-blue-500'
              }`}
          >
            <span className="text-white text-xs font-bold">{label}</span>
          </div>
        ))}
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <Input
          label="Cardholder Name"
          name="cardholderName"
          placeholder="John Doe"
          value={formData.cardholderName}
          onChange={handleInputChange}
        />
        <Input
          label="Card Number"
          name="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={formData.cardNumber}
          onChange={handleInputChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Expiry Date"
            name="expiryDate"
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChange={handleInputChange}
          />
          <Input
            label="CVV"
            name="cvv"
            placeholder="123"
            value={formData.cvv}
            onChange={handleInputChange}
          />
        </div>

        <Input
          label="Billing Address (Optional)"
          name="billingAddress"
          placeholder="Street Address"
          value={formData.billingAddress}
          onChange={handleInputChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleInputChange}
          />
          <Input
            name="zipCode"
            placeholder="ZIP Code"
            value={formData.zipCode}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="saveCard"
            checked={formData.saveCard}
            onChange={handleInputChange}
            className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:ring-primary"
          />
          <label className="text-gray-400 text-sm">Save card for future bookings</label>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={onBack}
          className="flex-1 bg-transparent border border-gray-600 text-white py-3 px-6 rounded-full hover:border-gray-500 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Summary
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex-1 bg-primary text-black font-semibold py-3 px-6 rounded-full hover:bg-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Lock className="w-4 h-4" />
          {isProcessing ? 'Processing...' : 'Pay $87.50'}
        </button>
      </div>
    </div>
  );
};

export default PaymentDetails;

// Helper input component
const Input = ({ label, name, placeholder, value, onChange }) => (
  <div>
    {label && (
      <label className="text-gray-400 text-sm block mb-2" htmlFor={name}>
        {label}
      </label>
    )}
    <input
      type="text"
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
    />
  </div>
);
