

// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import LoaderPage from "../pages/LoaderPage";

const AdminProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem('adminjwt');
  const email = localStorage.getItem("userEmail");
  const location = useLocation();

  // const from = location.state?.from || "/";
  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        // console.log("This is the value of the valid variable: ", isValid);
        setIsValid(false);
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL;

      console.log("This page was hit")
      try {
        const response = await axios.get(`${apiUrl}/auth/verifytoken`, {
          headers: {
            authorization: `Bearer ${token}`,
            "x-user-email": email, // Send email in custom header

          },
        });
        console.log("This is the response: ", response.data);
        if (response.status === 200) {
          setIsValid(true);
        }
        console.log("This is the value of the valid variable: ", isValid);
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsValid(false);
      }
    };

    verifyToken();
  }, [token, email]);

  if (isValid === null) return <div><LoaderPage /></div>;
  if (!isValid) return <Navigate to="/adminlogin" replace />;

  return children;
};

export default AdminProtectedRoute;
