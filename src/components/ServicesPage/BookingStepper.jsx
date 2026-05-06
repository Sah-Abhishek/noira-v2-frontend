import React from "react";
import { Link } from "react-router-dom";

const BookingStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Service Selected", redirect: "/allservicespage" },
    { id: 2, label: "Choose Therapist", redirect: "/choosetherapist" },
    { id: 3, label: "Confirm Booking", redirect: "/paymentpage" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center space-x-0 md:space-x-4 py-6">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center space-x-2">
              {/* Circle */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                  ${isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                      ? "bg-primary text-black"
                      : "bg-gray-700 text-gray-400"
                  }`}
              >
                {isCompleted ? "✓" : step.id}
              </div>

              {/* Label */}
              <Link to={step.redirect}
                className={`text-sm font-medium ${isCompleted
                  ? "text-green-400"
                  : isActive
                    ? "text-primary"
                    : "text-gray-400"
                  }`}
              >
                {step.label}
              </Link>
            </div>

            {/* Line between steps */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-[2px] ${isCompleted
                  ? "bg-green-500"
                  : isActive
                    ? "bg-primary"
                    : "bg-gray-600"
                  }`}
                style={{ marginTop: "16px", marginBottom: "16px" }} // Adding space between lines
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default BookingStepper;
