import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import axios from "axios";

export default function PostalCodeModal({ isOpen, onClose }) {
  const [postalCode, setPostalCode] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Fetch suggestions as user types
  useEffect(() => {
    if (!postalCode.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      if (!showSuggestions) {
        setLoadingSuggestions(false);
        return; // don't call API if suggestions are hidden
      }

      setLoadingSuggestions(true);
      try {
        const res = await axios.get(
          `https://api.postcodes.io/postcodes?q=${postalCode}&limit=3`
        );
        const result = res.data.result || [];
        setSuggestions(result.map((item) => item.postcode));
      } catch (err) {
        console.error("Error fetching postcodes:", err);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // debounce 300ms
    return () => clearTimeout(timeoutId);
  }, [postalCode, showSuggestions]);

  const onSubmit = (code) => {
    sessionStorage.setItem("postalCode", code);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!postalCode.trim()) return;
    onSubmit(postalCode);
    onClose();
  };

  const handleSelectSuggestion = (code) => {
    setPostalCode(code);
    setSuggestions([]);
    setShowSuggestions(false); // hide after selecting
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="bg-black text-white rounded-2xl shadow-2xl w-[90%] max-w-3xl p-10 relative border border-primary/20"
          >
            {/* Branding */}
            <div className="flex justify-center mb-4">
              <span className="px-3 py-1 rounded-md text-xs bg-primary text-black font-semibold">
                NOIRA
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
              Where would you like to book your{" "}
              <span className="text-primary">luxury massage?</span>
            </h2>
            <p className="text-center text-gray-400 mb-8">
              Select your location to find the best therapists near you
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 relative">
              <div className="relative">
                <label
                  htmlFor="postal"
                  className="block text-sm font-medium mb-2 text-gray-300"
                >
                  Address
                </label>
                <input
                  id="postal"
                  type="text"
                  value={postalCode}
                  onChange={(e) => {
                    setPostalCode(e.target.value);
                    setShowSuggestions(true); // show suggestions again when typing
                  }}
                  placeholder="Enter your postal code"
                  className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  autoComplete="off"
                />

                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-20 top-full left-0 right-0 bg-gray-900 border border-gray-700 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                    {suggestions.map((s, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSelectSuggestion(s)}
                        className="px-4 py-2 cursor-pointer hover:bg-primary/20"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}

                {loadingSuggestions && (
                  <div className="px-4 py-2 bg-gray-800">
                    <p className="absolute top-full mt-1 text-gray-400 text-sm">
                      Loading...
                    </p>
                  </div>
                )}

                <p className="mt-2 text-sm text-gray-500">
                  We’ll find qualified therapists in your area
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 flex items-center justify-center gap-2 rounded-lg bg-primary text-black font-semibold hover:bg-primary/90 transition"
              >
                CONTINUE →
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 flex justify-center">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Lock size={20} />
                Your location data is secure and private
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
