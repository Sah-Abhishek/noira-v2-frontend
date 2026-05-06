
const MassageServiceSkeleton = () => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-6 animate-pulse">
      {/* Title */}
      <div className="h-6 bg-gray-600 rounded w-1/3 mb-4"></div>

      {/* Description */}
      <div className="h-4 bg-gray-700 rounded w-2/3 mb-6"></div>

      {/* Grid of buttons */}
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center justify-between bg-black rounded-lg p-4">
            <div className="h-4 bg-gray-600 rounded w-1/2"></div>
            <div className="h-8 bg-yellow-800 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MassageServiceSkeleton;
