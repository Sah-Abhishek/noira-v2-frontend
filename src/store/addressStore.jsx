
// src/store/addressStore.js
import { create } from 'zustand';

const useAddressStore = create((set) => ({
  addresses: [],

  // Add a new address (can be any structure)
  addAddress: (newAddress) =>
    set((state) => ({
      addresses: [...state.addresses, newAddress],
    })),

  // Update address at specific index
  updateAddress: (index, updatedAddress) =>
    set((state) => {
      const updated = [...state.addresses];
      if (index >= 0 && index < updated.length) {
        updated[index] = updatedAddress;
      }
      return { addresses: updated };
    }),

  // Remove address by index
  removeAddress: (index) =>
    set((state) => ({
      addresses: state.addresses.filter((_, i) => i !== index),
    })),

  // Reset all addresses
  resetAddresses: () => set({ addresses: [] }),
}));

export default useAddressStore;
