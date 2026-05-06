// components/TrainingPolicies.jsx
import React from "react";
import { FileText } from "lucide-react"; // icon library

const TrainingPolicies = () => {
  const policies = [
    {
      id: 1,
      title: "Safety Guidelines",
      updated: "Dec 2024",
      color: "bg-red-600",
    },
    {
      id: 2,
      title: "Client Privacy Policy",
      updated: "Nov 2024",
      color: "bg-blue-600",
    },
    {
      id: 3,
      title: "Technique Manual",
      updated: "Oct 2024",
      color: "bg-green-600",
    },
  ];

  return (
    <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-lg text-white w-full">
      <h2 className="text-lg font-semibold mb-6">Training & Policies</h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="flex items-center gap-4 bg-[#1c2635] p-6 rounded-xl w-full hover:bg-[#243042] transition"
          >
            {/* PDF Icon */}
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-lg ${policy.color}`}
            >
              <FileText className="w-6 h-6 text-white" />
            </div>

            {/* Title & Date */}
            <div>
              <p className="font-medium text-base">{policy.title}</p>
              <p className="text-sm text-gray-400">
                Updated {policy.updated}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingPolicies;
