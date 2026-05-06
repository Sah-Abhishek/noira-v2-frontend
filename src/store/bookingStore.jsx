import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBookingStore = create(
  persist(
    (set) => ({
      // booking state
      userEmail: null,
      userPhoneNumber: null,
      findingTherapist: false,
      cart: [], // previously service
      date: null,
      time: null,
      hasSearched: false,
      userId: null,
      userDetails: null,
      services: [],
      therapists: [],
      selectedTherapist: null,
      userAddress: null,
      couponCode: null,
      userName: null,

      // setters
      setUserName: (userName) => set({ userName }),
      setCouponCode: (couponCode) => set({ couponCode }),
      setUserPhoneNumber: (phone) => set({ userPhoneNumber: phone }),
      setUserEmail: (email) => set({ userEmail: email }),
      setHasSearched: (value) => set({ hasSearched: value }),
      setFindingTherapist: (value) => set({ findingTherapist: value }),
      setTherapists: (therapists) => set({ therapists }),
      setCart: (cart) => set({ cart }),
      setDate: (date) => set({ date }),
      setTime: (time) => set({ time }),
      resetCart: () => set({ cart: [], date: null, time: null }),
      setSelectedTherapist: (therapist) => set({ selectedTherapist: therapist }),
      setUserAddress: (address) => set({ userAddress: address }),
      setUserId: (userId) => set({ userId }),
      setUserDetails: (user) => set({ userDetails: user }),
      setServices: (services) => set({ services }),
    }),
    {
      name: "booking-storage", // key in localStorage
      partialize: (state) => {
        const { hasSearched, ...rest } = state;
        return rest;
      },
    }
  )
);

export default useBookingStore;
