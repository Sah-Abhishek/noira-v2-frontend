
import React from "react";
import noiraLogo from "/noira.png"; // place noira.png in /src/assets/
import WelcomeBar from "../components/therapistDashboard/WelcomeBar";
import TherapistSidebar from "../components/therapistDashboard/TherapistSidebar";
import StatusCardsRow from "../components/therapistDashboard/StatusCardsRow";
import ScheduleManagement from "../components/therapistDashboard/ScheduleManagement";
import BookingRequests from "../components/therapistDashboard/BookingRequests";
import RecentFeedback from "../components/therapistDashboard/RecentFeedback";
import TrainingPolicies from "../components/therapistDashboard/TrainingAndPolicies";

const TherapistDashboard = () => {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      {/* Main Content */}
      {/* <TherapistSidebar /> */}
      <main className="flex-1 overflow-y-auto bg-[#0f0f0f] p-6">
        {/* Header */}
        <WelcomeBar />

        {/* Stats */}
        <div className="pt-6 ">
          <StatusCardsRow />
        </div>

        {/* Schedule Management */}
        <div className="  space-y-6 mb-6">
          <ScheduleManagement />
        </div>

        {/* Booking Requests */}

        {/*   <BookingRequests /> */}
        {/* </div> */}

        {/* Recent Feedback */}
        {/* <RecentFeedback /> */}

        {/* Training & Policies */}
        {/* <div> */}
        {/*   <TrainingPolicies /> */}
        {/* </div> */}
      </main>
    </div>
  );
};

export default TherapistDashboard;
