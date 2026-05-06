import React from "react";
import useBookingStore from "../../store/bookingStore.jsx";
import TherapistSelectionCard from "./TherapistsSelectionCards";
import TherapistSkeletonCard from "./TherapistCardSkeleton.jsx";
import TherapistSkeletonList from "./TherapistCardSkeleton.jsx";

const TherapistSelection = ({ isAbled, setIsAbled }) => {
  const therapists = useBookingStore((state) => state.therapists);
  const { findingTherapist, hasSearched } = useBookingStore();

  if (!hasSearched) {
    return (<></>)
  }


  if ((hasSearched && !Array.isArray(therapists)) || therapists.length === 0) {
    return (
      <div className="bg-slate-800 mt-40 px-5 py-3 rounded-lg  flex items-center justify-center">
        <p className="text-yellow-400 text-lg">No therapists available</p>
      </div>
    );
  }


  if (findingTherapist) {
    return (
      <TherapistSkeletonList />

    )
  }

  return (
    <div
      className={`p-6 mt-40 bg-black gap-6
    grid 
    ${therapists.length === 1
          ? "grid-cols-1 place-items-center"
          : therapists.length === 2
            ? "grid-cols-1 sm:grid-cols-2 place-items-center"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}
    >
      {therapists.map((therapist) => (
        <TherapistSelectionCard key={therapist._id} therapist={therapist} />
      ))}
    </div>
  );
};

export default TherapistSelection;
