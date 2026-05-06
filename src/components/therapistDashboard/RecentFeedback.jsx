
// components/RecentFeedback.jsx
import React from "react";

const RecentFeedback = () => {
  const feedbacks = [
    {
      id: 1,
      name: "David Rodriguez",
      review:
        "Amazing session! Sarah really knows how to target problem areas. Highly recommend!",
      rating: 5,
      avatar: "https://i.pravatar.cc/50?img=8",
    },
    {
      id: 2,
      name: "Lisa Thompson",
      review:
        "Perfect pressure and technique. Very professional and relaxing environment.",
      rating: 5,
      avatar: "https://i.pravatar.cc/50?img=32",
    },
  ];

  return (
    <div className="bg-[#111111] rounded-2xl p-6 border border-white/10 mb-6 shadow-lg text-white">
      <h2 className="text-lg font-semibold mb-4">Recent Feedback</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedbacks.map((fb) => (
          <div
            key={fb.id}
            className="bg-[#1c2635] p-5 rounded-xl flex flex-col gap-3"
          >
            {/* User Info */}
            <div className="flex items-center gap-3">
              <img
                src={fb.avatar}
                alt={fb.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{fb.name}</p>
                {/* Rating */}
                <div className="flex text-yellow-400">
                  {Array.from({ length: fb.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Review Text */}
            <p className="text-sm text-gray-300 italic">"{fb.review}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentFeedback;
