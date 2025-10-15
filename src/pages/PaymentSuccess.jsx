import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get("session_id");
  const address = searchParams.get("address"); // "false" or actual address
  const userId = searchParams.get("userId");
  const postalCode = searchParams.get("PostalCode");
  console.log("This is the postalCode: ", postalCode);

  const [formData, setFormData] = useState({
    address: {
      Building_No: "",
      Locality: "",
      Street: "",
      PostTown: "",
      PostalCode: postalCode || "", // 👈 prefilled here
    },
  });

  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${apiUrl}/user/add_address/${userId}`,
        formData // 👈 send the whole object including PostalCode
      );
      toast.success("Address saved successfully!");
      console.log("API response:", res.data);

      // redirect after save
      navigate("/user/mybookings");
    } catch (err) {
      toast.error("Failed to save address");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showAddressForm = address === "false";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/40">
          <CheckCircle className="w-12 h-12 text-black" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-primary mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-400 mb-6">
          Your booking has been confirmed. A confirmation email has been sent.
        </p>

        {showAddressForm ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-[#0d0d0d] p-6 rounded-xl border border-primary/30"
          >
            {Object.keys(formData.address).map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field.replace("_", " ")}
                value={formData.address[field]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, [field]: e.target.value },
                  }))
                }
                required
                disabled={field === "PostalCode"} // 👈 disable postal code
                className={`w-full px-4 py-3 rounded-lg bg-black border border-primary/40 text-white ${field === "PostalCode"
                  ? "cursor-not-allowed opacity-70"
                  : ""
                  }`}
              />
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-semibold py-3 px-6 rounded-full hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
          </form>
        ) : (
          <a
            href="/user/mybookings"
            className="inline-block bg-primary text-black font-semibold py-3 px-6 rounded-full hover:opacity-90 transition"
          >
            Go to Bookings
          </a>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
