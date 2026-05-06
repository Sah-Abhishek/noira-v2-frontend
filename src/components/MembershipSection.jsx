
import React from "react";

export default function MembershipSection() {
  return (
    <div className=" flex flex-col items-center justify-center bg-black pt-10 text-[#C49E5B] px-4">
      <h1 className="text-3xl sm:text-4xl text-[#D59940] font-braven text-center font-bold mb-15">
        Black Label Membership
      </h1>

      <div className="max-w-lg text-center space-y-6 border border-[#C49E5B] p-10 rounded-4xl shadow-lg shadow-[#C49E5B]/30">

        {/* Title */}

        {/* Subtitle */}
        <p className=" font-whisper text-3xl italic">
          An invitation into Noira’s community.        </p>

        {/* Description */}
        <p className="leading-relaxed">



          Reserved for discerning clients who expect more than exceptional.
        </p>

        {/* Features */}
        <ul className="space-y-3 text-left list-disc list-inside">
          <li>
            <span className="font-semibold">Priority</span> access to peak-time appointments
          </li>
          <li>
            <span className="font-semibold">Seasonal ritual exclusives</span> curated only for members
          </li>
          <li>
            A <span className="font-semibold">private</span>, direct line to your dedicated Noira concierge
          </li>
        </ul>

        {/* Closing Statement */}
        <p className="leading-relaxed">
          Membership is strictly limited and extended         </p>

        {/* Button */}
        {/* <button className="px-6 py-3 border r-[#C49E5B] text-[#C49E5B] font-semibold rounded hover:bg-[#C49E5B] hover:text-black transition-all duration-300"> */}
        {/*   REQUEST */}
        {/* </button> */}
      </div>
    </div>
  );
}
