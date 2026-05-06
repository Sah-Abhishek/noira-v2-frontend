import React from "react";
import BookingStepper from "./BookingStepper";


const HeroSectionServices = () => {
  return (
    <section className="relative h-[60vh] w-full flex flex-col items-center justify-center">
      {/* background */}
      <div className="absolute inset-0 h-full">
        <img
          src="https://images.unsplash.com/photo-1598901986949-f593ff2a31a6?q=80&w=2097&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=m3wxmja3fdb8mhxwag90by1wywdlfhx8fgvufdb8fhx8fa%3d%3d"
          alt="massage spa background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* content */}
      <div className="relative text-center text-white px-4 z-10">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="text-[#c49e5b]">noira</span>{" "}
          <span className="text-white">services</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          luxury made accessible
        </p>
        <div className="mt-4 flex justify-center">
          <span className="block w-12 h-[2px] bg-[#c49e5b]"></span>
        </div>

        {/* Booking Stepper inside Hero */}
        <div className="mt-8 max-w-3xl mx-auto">
          <BookingStepper
            currentStep={1} />
        </div>
      </div>
    </section>
  );
};

export default HeroSectionServices;
