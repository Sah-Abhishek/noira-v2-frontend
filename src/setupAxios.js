// src / setupAxios.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// 🔹 Identify token & role
const getTokenInfo = () => {
  if (localStorage.getItem("userjwt")) {
    return { role: "user", token: localStorage.getItem("userjwt") };
  }
  if (localStorage.getItem("therapistjwt")) {
    return { role: "therapist", token: localStorage.getItem("therapistjwt") };
  }
  if (localStorage.getItem("adminjwt")) {
    return { role: "admin", token: localStorage.getItem("adminjwt") };
  }
  return { role: null, token: null };
};

const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

// 🔹 Request Interceptor
axios.interceptors.request.use(
  (config) => {
    const excludedUrl = "https://api.postcodes.io/postcodes";

    // Skip attaching auth if it's the postcode API
    if (!config.url.startsWith(excludedUrl)) {
      const token = getTokenInfo();
      if (token && !isTokenExpired(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response Interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { role } = getTokenInfo();

      if (role === "user") {
        localStorage.removeItem("userjwt");
        window.location.href = "/userlogin";
      } else if (role === "therapist" || role === "admin") {
        localStorage.removeItem("therapistjwt");
        localStorage.removeItem("adminjwt");
        window.location.href = "/adminlogin";
      } else {
        // fallback if no token at all
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);
