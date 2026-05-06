import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import useBookingStore from "../../store/bookingStore";
import { X } from "lucide-react";
import useAddressStore from "../../store/addressStore";

const AddressModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    buildingNo: "",
    street: "",
    locality: "",
    postTown: "",
    postalCode: "",
  });
  const [options, setOptions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const userjwt = localStorage.getItem("userjwt");
  const isLoggedIn = !!userjwt;
  const { setUserAddress } = useBookingStore();
  const { addAddress } = useAddressStore();

  if (!isOpen) return null;

  const handlePostalSearch = async (value) => {
    setFormData((prev) => ({ ...prev, postalCode: value }));

    if (value.length > 2) {
      try {
        const res = await axios.get(
          `https://api.postcodes.io/postcodes?q=${value}&limit=5`
        );
        if (res.data?.result) {
          setOptions(res.data.result.map((r) => r.postcode));
          setShowSuggestions(true);
        } else {
          setOptions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        console.error("Postcode fetch error:", err);
        setOptions([]);
        setShowSuggestions(false);
      }
    } else {
      setOptions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectPostcode = (postcode) => {
    setFormData((prev) => ({ ...prev, postalCode: postcode }));
    setShowSuggestions(false);
  };

  const userId = localStorage.getItem("userId");
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.postalCode || !options.includes(formData.postalCode)) {
      toast.error("Please select a valid postcode from the list");
      return;
    }

    if (!isLoggedIn) {
      setUserAddress(formData);
      onClose();
      return;
    }

    try {
      await axios.put(`${apiUrl}/user/${userId}/address`, formData, {
        headers: { Authorization: `Bearer ${userjwt}` },
      });

      toast.success("Address saved successfully");
      setUserAddress(formData);
      sessionStorage.setItem("postalCode", formData.postalCode);
      sessionStorage.setItem("userAddress", JSON.stringify(formData));

      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-black text-[#D4AF37] border border-white/20 rounded-2xl p-8 w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-primary">
            Where should the therapist come?
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-500 transition"
          >
            <X />
          </button>
        </div>

        <p className="text-sm text-gray-200 mb-6">
          To ensure a seamless in-home therapy experience, we need your complete
          address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="buildingNo"
              placeholder="Building No"
              value={formData.buildingNo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, buildingNo: e.target.value }))
              }
              className="bg-transparent border border-white/40 text-white rounded-lg px-4 py-3"
            />
            <input
              name="street"
              placeholder="Street"
              value={formData.street}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, street: e.target.value }))
              }
              className="bg-transparent border border-white/40 text-white rounded-lg px-4 py-3"
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="locality"
              placeholder="Locality"
              value={formData.locality}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, locality: e.target.value }))
              }
              className="bg-transparent border border-white/40 text-white rounded-lg px-4 py-3"
            />
            <input
              name="postTown"
              placeholder="Post Town"
              value={formData.postTown}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, postTown: e.target.value }))
              }
              className="bg-transparent border border-white/40 text-white rounded-lg px-4 py-3"
            />
          </div>

          {/* Postal Code with Inline Suggestions */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search Postal Code..."
              value={formData.postalCode}
              onChange={(e) => handlePostalSearch(e.target.value)}
              onFocus={() => options.length > 0 && setShowSuggestions(true)}
              className="w-full bg-transparent border border-white/40 text-white rounded-lg px-4 py-3"
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && options.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-white/40 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                {options.map((postcode, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectPostcode(postcode)}
                    className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0"
                  >
                    {postcode}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-primary text-black font-semibold py-3 rounded-lg hover:bg-yellow-200 transition"
          >
            Confirm Address
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
