import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import CareerPage from "./pages/CareerPage";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/About.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import OtpInput from "./pages/OtpInput.jsx";
import UserSignup from "./pages/UserSignup.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import ChooseTherapistPage from "./pages/ChooseTherapistPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PaymentPage from "./pages/PaymentFinalPage.jsx";

import LoaderPage from "./pages/LoaderPage.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentFail from "./pages/PaymentFail.jsx";
import FindTherapistByAvailability from "./components/FindTherapistByAvailability.jsx";

// Protected routes
import UserProtectedRoute from "./components/UserProtectedRoute.jsx";
import TherapistProtectedRoute from "./components/TherapistProtectedRoute.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";

// Therapist layout + pages
import TherapistLayout from "./layouts/TherapistLayout.jsx";
import TherapistDashboard from "./pages/TherapistDashobard.jsx";
import TherapistSchedule from "./layouts/TherapistSchedule.jsx";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./components/therapistSchedule/forgotPassword/forgotPassword.jsx";
import ResetPasswordPage from "./components/therapistSchedule/forgotPassword/ResetPasswordPage.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AllServicesPage from "./pages/AllServicesPage.jsx";
import BrowseTherapists from "./components/browseTherapist/BrowseTherapist.jsx";
import FeaturedTherapists from "./components/FeaturedTherapist.jsx";
import ServiceByTherapist from "./components/byTherapistFlow/ServicesByTherapist.jsx";
import TherapistManagement from "./components/Admin/TherapistManagement.jsx";
import AddNewTherapist from "./components/Admin/AddNewTherapist.jsx";
import TherapistProfile from "./components/TherspistProfile/TherapistProfileTherapist.jsx";
import CreateNewService from "./components/createNewService.jsx";
import ServiceManagement from "./components/serviceManagement/ServiceManagement.jsx";
import UserProfile from "./components/user/UserProfile.jsx";
import EditTherapistProfile from "./components/therapist/EditTherapistProfile.jsx";
import TherapistProfileTherapist from "./components/TherspistProfile/TherapistProfileTherapist.jsx";
import EditService from "./components/serviceManagement/EditService.jsx";
import EditTherapistProfileAdmin from "./components/Admin/EditTherapistProfileAdmin.jsx";
import BookingsManagement from "./components/Admin/BookingsManagement.jsx"
import UserLayout from "./layouts/UserLayout.jsx";
import UserEditProfile from "./components/user/UserEditProfile.jsx";
import MyBookings from "./components/user/MyBookings.jsx";
import UserDashboard from "./components/user/UserDashboard.jsx";
import TherapistBookingsPage from "./components/therapist/TherapistMyBookings.jsx";
import BookingsPage from "./components/user/MyBookings.jsx";
import ReviewBookingsPage from "./components/user/ReviewBookingPage.jsx";
import UsersManagement from "./components/Admin/UsersManagement.jsx";
import AdminProfile from "./components/adminDashboard/AdminProfile.jsx";
import AdminEditProfile from "./components/Admin/AdminEditProfile.jsx";
import BlogPage from "./Blog/BlogPage.jsx";
import BlogPageArticle from "./Blog/BlogPageArticle.jsx";
import BookingConfirmedByCash from "./pages/BookingConfirmedByCashPage.jsx";
import SettlementReportsPage from "./components/Admin/settlementReports/settlementReportsPage.jsx";
import TherapistPayout from "./components/TherapistPayout/TherapistPayout.jsx";
import PrivacyPolicy from "./informationPages/PrivacyPolicy.jsx";
import TermsAndConditions from "./informationPages/TermsAndCondition.jsx";
import CodeOfEthics from "./informationPages/CodeOfEthics.jsx";
import GDPRStatement from "./informationPages/GPDRStatement.jsx";
import CancellationPolicy from "./informationPages/CancellationPolicy.jsx";
import RefundPolicy from "./informationPages/RefundPolicy.jsx";
import HealthAndSafety from "./informationPages/HealthAndSafetyPolicy.jsx";
import ResourcesPage from "./components/therapist/TherapistResources.jsx";
import ReviewsPage from "./components/Admin/ReviewsManagement/ReviewsPage.jsx";

const AppRoutes = () => {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/careers" element={<CareerPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/otpinput/:purpose" element={<OtpInput />} />
        <Route path="/usersignup" element={<UserSignup />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/loading" element={<LoaderPage />} />
        <Route path="/paymentsuccess" element={<PaymentSuccess />} />
        <Route path="/paymentfail" element={<PaymentFail />} />
        <Route path="/auth/forgotpassword" element={<ForgotPassword />} />
        <Route path="/auth/resetpassword/:token" element={<ResetPasswordPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/termsandcondition" element={<TermsAndConditions />} />
        <Route path="/codeofethics" element={<CodeOfEthics />} />
        <Route path="/gpdrstatement" element={<GDPRStatement />} />
        <Route path="/cancellationpolicy" element={<CancellationPolicy />} />
        <Route path="/refundpolicy" element={<RefundPolicy />} />
        <Route path="/healthandsafetypolicy" element={<HealthAndSafety />} />
        <Route path="/accessibility" element={<HealthAndSafety />} />
        <Route path="/blog/:id" element={<BlogPageArticle />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="/servicesbytherapist"
          element={
            <ServiceByTherapist />
          }
        />

        {/* Protected User Routes */}
        {/* <Route */}
        {/*   path="/servicespage" */}
        {/*   element={ */}
        {/*     <UserProtectedRoute> */}
        {/*       <ServicesPage /> */}
        {/*     </UserProtectedRoute> */}
        {/*   } */}
        {/* /> */}
        <Route
          path="/findtherapistbyavailability"
          element={
            <FindTherapistByAvailability />
          }
        />
        <Route
          path="/bookingconfirmedbycash"
          element={
            <BookingConfirmedByCash />
          }
        />
        {/* <Route */}
        {/*   path="/user/userprofile" */}
        {/*   element={ */}
        {/*     <UserProtectedRoute> */}
        {/*       <UserProfile /> */}
        {/*     </UserProtectedRoute> */}
        {/*   } */}
        {/* /> */}

        <Route
          path="/browsetherapists"
          element={
            <BrowseTherapists />
          }
        />
        <Route path="/allservicespage" element={<AllServicesPage />} />
        <Route
          path="/cartpage"
          element={
            <UserProtectedRoute>
              <CartPage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/choosetherapist"
          element={
            <ChooseTherapistPage />
          }
        />
        <Route
          path="/paymentpage"
          element={
            <PaymentPage />
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="admindashboard" replace />} />
          <Route path="admindashboard" element={<AdminDashboard />} />
          <Route path="therapistmanagement" element={<TherapistManagement />} />
          <Route path="addnewtherapist" element={<AddNewTherapist />} />
          <Route path="createnewservice" element={<CreateNewService />} />
          <Route path="servicemanagement" element={<ServiceManagement />} />
          <Route path="edittherapistprofileadmin/:id" element={<EditTherapistProfileAdmin />} />
          <Route path="editservice/:id" element={<EditService />} />
          <Route path="bookingsmanagement" element={<BookingsManagement />} />
          <Route path="usermanagement" element={<UsersManagement />} />
          <Route path="adminprofile" element={<AdminProfile />} />
          <Route path="admineditprofile" element={<AdminEditProfile />} />
          <Route path="settlementreports" element={<SettlementReportsPage />} />
          <Route path="reviewsmanagement" element={<ReviewsPage />} />


        </Route>

        {/* User Protected Routes */}
        <Route
          path="/user"
          element={
            <UserProtectedRoute>
              <UserLayout />
            </UserProtectedRoute>
          }
        >
          <Route index element={<Navigate to="userprofile" replace />} />
          <Route path="userProfile" element={<UserProfile />} />
          <Route path="usereditprofile" element={<UserEditProfile />} />
          <Route path="mybookings" element={<MyBookings />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="reviewbooking/:id" element={<ReviewBookingsPage />} />

        </Route>

        {/* Therapist Protected Routes */}
        <Route
          path="/therapist"
          element={
            <TherapistProtectedRoute>
              <TherapistLayout />
            </TherapistProtectedRoute>
          }
        >
          <Route index element={<Navigate to="therapistdashboard" replace />} />
          <Route path="therapistdashboard" element={<TherapistDashboard />} />
          <Route path="therapistprofile/:id" element={<TherapistProfile />} />
          <Route path="therapistprofiletherapist" element={<TherapistProfileTherapist />} />
          <Route path="edittherapistprofile" element={<EditTherapistProfile />} />
          <Route path="therapistbookingspage" element={<TherapistBookingsPage />} />
          <Route path="therapistpayout" element={<TherapistPayout />} />
          <Route path="therapistresources" element={<ResourcesPage />} />
          <Route
            path="therapistschedule"
            element={
              <TherapistProtectedRoute>
                <TherapistSchedule />
              </TherapistProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
