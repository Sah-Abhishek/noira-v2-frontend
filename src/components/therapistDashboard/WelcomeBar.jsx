import React from "react";
import { Bell, Star } from "lucide-react";

const WelcomeBar = () => {
  // Format today's date dynamically
  const today = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);
  const firstName = localStorage.getItem('firstname')
  // console.log("This is the firstName: ", firstName);

  return (
    <div className="flex  border border-white/10 items-center justify-between bg-[#111111] text-white px-6 py-4 rounded-2xl shadow">
      {/* Left - Greeting */}
      <div>
        <h2 className="text-lg font-semibold">Welcome back, {firstName}</h2>
        <p className="text-sm text-gray-400">Today is {formattedDate}</p>
      </div>

      {/* Right - Icons */}
      {/* <div className="flex items-center gap-4"> */}
      {/*   <div className="flex items-center gap-1 bg-[#1c1c1c] px-3 py-1 rounded-xl shadow"> */}
      {/*     <Star className="text-yellow-400 w-4 h-4" /> */}
      {/*     <span className="text-sm font-medium">4.9</span> */}
      {/*   </div> */}
      {/**/}
      {/*   <div className="relative"> */}
      {/*     <Bell className="w-6 h-6 text-gray-300 cursor-pointer hover:text-white transition" /> */}
      {/*     <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-black"></span> */}
      {/*   </div> */}
      {/* </div> */}
    </div>
  );
};

export default WelcomeBar;
