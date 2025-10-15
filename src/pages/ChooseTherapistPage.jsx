import { useEffect, useState } from "react";
import DateTimePicker from "../components/ChooseTherapist/DateTimePicker";
import StickyCartSummary from "../components/ChooseTherapist/StickyCartSummary";
import TherapistSelection from "../components/ChooseTherapist/TherapistSelection";
import BookingStepper from "../components/ServicesPage/BookingStepper";
import useBookingStore from "../store/bookingStore";
import AddressModal from "../components/Modals/AddressModal";
import useUserStore from "../store/UserStore.jsx"

const ChooseTherapistPage = () => {
  const [isDateAndTimeSelected, setIsDateAndTimeSelected] = useState(false);
  const { selectedTherapist, setSelectedTherapist, date, time } = useBookingStore();
  const { userAddress } = useBookingStore();



  useEffect(() => {
    if (selectedTherapist && date && time) {
      setIsDateAndTimeSelected(true);
    } else {
      setIsDateAndTimeSelected(false);
    }
  }, [selectedTherapist, date, time]);

  useEffect(() => {
    setSelectedTherapist();
  }, []);

  return (
    <div className="min-h-screen pb-30 pt-10 bg-black justify-center flex flex-col items-center">
      {/* Stepper */}
      <div className="w-full max-w-4xl mt-5 px-4">
        <BookingStepper currentStep={2} />
      </div>

      {/* DateTimePicker and TherapistSelection */}
      <div className="flex flex-col sm:flex-row">
        <div className="w-full max-w-4xl px-4 mt-8">
          <DateTimePicker />
        </div>
        <div>
          <TherapistSelection
            setIsAbled={setIsDateAndTimeSelected}
            isAbled={isDateAndTimeSelected}
          />
        </div>
      </div>

      {/* Sticky Cart Summary and Address Modal */}
      <div>
        <StickyCartSummary
          setIsAbled={setIsDateAndTimeSelected}
          isAbled={isDateAndTimeSelected}
        />
        {/* Uncomment if address modal should be shown */}
        {/* 
        <AddressModal 
          isOpen={isAddressModalOpen} 
          onClose={() => setIsAddressModalOpen(false)} 
        /> 
        */}
      </div>
    </div>
  );
};

export default ChooseTherapistPage;
