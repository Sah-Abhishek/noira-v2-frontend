import React from 'react';
import "./setupAxios.js";  // 👈 Add this


import AppRoutes from './AppRoutes';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';


function AppLayout() {
  const location = useLocation();

  // Add all paths where navbar should be hidden
  const hideNavbarPaths = [
    '/adminlogin',
    '/otpinput',
    '/usersignup',
    '/userlogin',
    '/therapist/therapistdashboard',
    '/therapist/dashboard',
    '/therapist/therapistschedule',
    '/auth/forgotpassword',
    '/auth/resetpassword/:token',
    '/admin/admindashboard',
    '/admin/therapistmanagement',
    '/paymentsuccess',
    '/paymentfail',
    '/admin/addnewtherapist',
    '/admin/therapistprofile/:id',
    '/therapist/therapistprofile/:id',
    '/admin/createnewservice',
    '/admin/servicemanagement',
    '/admin/edittherapistprofileadmin/:id',
    '/therapist/edittherapistprofile/:id',
    `/admin/editservice/:id`,
    '/user/userprofile',
    '/admin/bookingsmanagement',
    '/user/userprofile',
    '/user/usereditprofile',
    '/user/mybookings',
    '/therapist/edittherapistprofile',
    '/user/userdashboard',
    '/therapist/therapistbookingspage',
    '/therapist/therapistprofiletherapist',
    '/user/reviewbooking/:id',
    '/admin/usermanagement',
    '/admin/adminprofile',
    '/admin/admineditprofile',
    '/admin/settlementreports',
    '/therapist/therapistpayout',
    '/therapist/therapistresources',
    '/admin/reviewsmanagement',
  ];

  const shouldHideNavbar = hideNavbarPaths.some((path) => {
    if (path.includes(':id')) {
      const regex = new RegExp(path.replace(':id', '[^/]+') + '$');
      return regex.test(location.pathname);
    }
    return location.pathname === path;
  });

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
