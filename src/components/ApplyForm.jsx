import React from "react";

const ApplyForm = () => {
  return (
    <div id="apply" className="px-4 py-16 bg-black text-white">
      {/* Heading */}
      <h2 className="text-center text-3xl md:text-4xl mb-4 text-[#C49E5B] hover:text-yellow-400 transition-colors">
        Apply Now
      </h2>
      <p className="text-center mb-10">
        Send your application to{" "}
        <a
          href="mailto:careers@noiralondon.com"
          className="text-[#95793e] hover:underline"
        >
          careers@noira.co.uk
        </a>
      </p>
    </div>
  );
};

export default ApplyForm;
