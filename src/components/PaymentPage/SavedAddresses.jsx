import React, { useEffect, useState } from "react";
import axios from "axios";
import { Home, Plus } from "lucide-react";
import useBookingStore from "../../store/bookingStore.jsx";
import AddressModal from "../Modals/AddressModal.jsx";

export default function SavedAddresses({ refreshKey, setLengthOfReturnedAddresses }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Zustand store
  const { userAddress, setUserAddress } = useBookingStore();
  const [selectedId, setSelectedId] = useState(userAddress?._id || null);

  const userId = localStorage.getItem("userId");
  const apiUrl = import.meta.env.VITE_API_URL;
  const userjwt = localStorage.getItem("userjwt");
  // console.log("This is the user Address: ", userAddress);

  const fetchAddresses = async () => {
    if (!userjwt) {

      setAddresses([userAddress]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/user/${userId}/alladdress`, {
        headers: { Authorization: `Bearer ${userjwt}` },
      });

      const all = res.data.allAddresses || [];
      setAddresses(all);
      setLengthOfReturnedAddresses(all.length);
      if (userAddress?._id) {
        setSelectedId(userAddress._id);
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err);
      setAddresses([]); // ✅ just reset addresses
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [refreshKey, userAddress?._id]);

  const handleSelectAddress = async (id) => {
    setSelectedId(id);
    if (!userjwt) return;

    try {
      const response = await axios.post(
        `${apiUrl}/user/${userId}/default`,
        { addressId: id },
        { headers: { Authorization: `Bearer ${userjwt}` } }
      );

      if (response.status === 200) {
        setUserAddress(response.data.address); // ✅ Update store
      }
    } catch (err) {
      console.error("Failed to set default address", err);
    }
  };

  const handleAddressAdded = async () => {
    setIsAddressModalOpen(false);
    await fetchAddresses(); // ✅ refresh after adding
  };

  if (loading) return <p className="text-gray-400">Loading addresses...</p>;

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-primary text-2xl font-semibold mb-6">
        Saved Addresses
      </h2>

      {addresses.length === 0 ? (
        <p className="text-gray-400 mb-6">No saved addresses found.</p>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
          {addresses.map((addr, index) => (
            <div
              key={addr._id || index}
              onClick={() => handleSelectAddress(addr._id)}
              className={`bg-[#111] p-4 rounded-xl border transition-colors cursor-pointer ${selectedId === addr._id
                ? "border-primary ring-2 ring-primary"
                : "border-primary/20 hover:border-primary"
                }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Home className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-white">
                  {addr.PostTown || addr.postTown}
                </h3>
              </div>
              <p className="text-gray-300 text-sm">
                {addr.Building_No || addr.buildingNo}, {addr.Street || addr.street}
              </p>
              <p className="text-gray-300 text-sm">
                {addr.Locality || addr.locality}, {addr.PostTown || addr.postTown}
              </p>
              <p className="text-gray-300 text-sm">{addr.PostalCode || addr.postalCode}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add New Address Button (always visible) */}
      <button
        onClick={() => setIsAddressModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-primary text-black font-semibold hover:scale-105 transition-transform"
      >
        <Plus className="w-5 h-5" />
        Add New Address
      </button>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={handleAddressAdded} // ✅ Refresh after modal closes
      />
    </div>
  );
}
