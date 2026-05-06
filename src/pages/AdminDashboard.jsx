import ActiveAndInactiveTherapist from "../components/adminDashboard/ActiveTherapistTable";
import ActiveTherapistGraph from "../components/adminDashboard/AdminGraph/ActiveTherapists";
import AdminHeaderComponent from "../components/adminDashboard/AdminHeaderComponent";
import AdminSidebar from "../components/adminDashboard/AdminSidebar";
import RevenueDashboard from "../components/adminDashboard/RevenueDashboard";
import StatusCardRow from "../components/adminDashboard/StatusCardsRow";

const AdminDashboard = () => {
  return (
    <div className="text-white bg-black min-h-screen">
      <AdminHeaderComponent />
      <StatusCardRow />

      <div className="p-8">
        {/* Grid of 4 Graphs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          <ActiveTherapistGraph title="Active Therapists" />
          {/* <ActiveTherapistGraph title="New Signups" /> */}
          {/* <ActiveTherapistGraph title="Revenue Trend" /> */}
          {/* <ActiveTherapistGraph title="Session Bookings" /> */}
        </div>

      </div>
      <ActiveAndInactiveTherapist />

    </div>
  );
};

export default AdminDashboard;
