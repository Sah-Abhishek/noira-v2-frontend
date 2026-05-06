const TherapistSkeletonCard = () => {
  return (
    <div className="animate-pulse bg-[#111] rounded-xl p-6 w-full max-w-xs shadow-md flex flex-col items-center space-y-4">
      {/* Avatar */}
      <div className="w-20 h-20 bg-gray-700 rounded-full relative">
        <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-500 ring-2 ring-[#0f172a]" />
      </div>

      {/* Name */}
      <div className="h-4 bg-gray-600 rounded w-32" />

      {/* Role */}
      <div className="h-3 bg-gray-700 rounded w-24" />

      {/* Rating */}
      <div className="h-4 bg-gray-700 rounded w-28" />

      {/* Tags */}
      <div className="flex flex-wrap gap-2 justify-center">
        <div className="w-16 h-6 bg-gray-700 rounded-full" />
        <div className="w-14 h-6 bg-gray-700 rounded-full" />
        <div className="w-20 h-6 bg-gray-700 rounded-full" />
      </div>

      {/* Location */}
      <div className="w-40 h-3 bg-gray-700 rounded" />
      <div className="w-36 h-3 bg-gray-700 rounded" />

      {/* Price */}
      <div className="h-4 bg-gray-600 rounded w-24" />

      {/* Button */}
      <div className="w-full h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mt-2 opacity-40" />
    </div>
  );
};

const TherapistSkeletonList = () => {
  return (
    <div className="flex inline-flex mt-40 px-10 rounded-lg justify-center gap-6 py-12 bg-black text-white">
      <TherapistSkeletonCard />
      <TherapistSkeletonCard />
      <TherapistSkeletonCard />
    </div>
  );
};

export default TherapistSkeletonList;
