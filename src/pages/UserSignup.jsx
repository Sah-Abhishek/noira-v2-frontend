import React, { useState } from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import "../index.css";
import { zoomies } from "ldrs";
zoomies.register();
import noira from "/noira.png";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaUserPlus,
  FaMapMarkerAlt,
  FaPhone,
  FaGoogle,
  FaApple,
} from "react-icons/fa";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import useUserStore from "../store/UserStore";

// ✅ List of London & Greater London postal code prefixes
// const LONDON_POSTCODES = [
//   "E", "EC", "N", "NW", "SE", "SW", "W", "WC", // London core
//   "BR", "CR", "DA", "EN", "HA", "IG", "KT", "RM", "SM", "TW", "UB", "WD" // Greater London
// ];

// Validation schema
const schema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string(),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phone: Yup.string()
    .required("Phone is required")
    .matches(/^\d{6,10}$/, "Enter 6 to 10 digits (after +44)"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  // postalCode: Yup.string()
  //   .required("Postal code is required")
  //   .test("is-london", "We do not provide service in your area", (value) => {
  //     if (!value) return false;
  //     const code = value.trim().toUpperCase();
  //     return LONDON_POSTCODES.some((prefix) => code.startsWith(prefix));
  //   }),
});

export default function UserSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const apiUrl = import.meta.env.VITE_API_URL;

  const googleSignup = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        const res = await axios.post(`${apiUrl}/auth/google`, {
          token: credentialResponse.access_token,
        });
        console.log("This is the response from the google: ", res);

        setUser(res.data.user);

        toast.success("Signin successful");
        localStorage.setItem("userjwt", res.data.token);
        localStorage.setItem("userEmail", res.data.user.email);
        localStorage.setItem("userId", res.data.user._id);
        navigate("/allservicespage");
      } catch (error) {
        console.error("Google login error:", error);
        setErrorMsg("Google login failed");
      }
    },
    onError: () => {
      setErrorMsg("Google Login Failed");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const endpoint = `${apiUrl}/auth/user/register`;

    const transformedData = {
      name: { first: data.firstName, last: data.lastName },
      email: data.email,
      phone: data.phone,
      password: data.password,
      postalCode: data.postalCode,
    };

    try {
      setIsLoading(true);
      const response = await axios.post(endpoint, transformedData);
      if (response.status == 200) {

      }
      if (response.status === 201) {
        localStorage.setItem("userEmail", data.email);

        navigate("/otpinput/register");
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(`Signup failed: ${error.response.data.message || error.response.statusText}`);
        toast.error(error.response.message)
      } else if (error.request) {
        setErrorMsg("No response from server. Please try again later.");
      } else {
        setErrorMsg(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#1c1c1c] rounded-xl shadow-lg p-8 space-y-6 relative">
        {/* Logo and Title */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center h-10 mt-10">
            <Link to="/">

              <img src={noira} alt="Logo" className="h-10 sm:h-15 mb-10" />
            </Link>
          </div>
          <p className="text-gray-400 text-medium font-medium">Wellness Platform</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 caret-white">
          {/* First Name */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300 flex items-center gap-2">
              <FaUser className="text-primary" /> First Name
            </label>
            <input
              type="text"
              placeholder="Enter your first name"
              {...register("firstName")}
              className={`w-full px-4 py-3 rounded-md bg-[#2b2b2b] text-white placeholder-gray-500 outline-none focus:ring-2 ${errors.firstName ? "ring-red-500" : "focus:ring-primary"
                }`}
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
          </div>

          {/* Last Name */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300 flex items-center gap-2">
              <FaUser className="text-primary" /> Last Name
            </label>
            <input
              type="text"
              placeholder="Enter your last name"
              {...register("lastName")}
              className={`w-full px-4 py-3 rounded-md bg-[#2b2b2b] text-white placeholder-gray-500 outline-none focus:ring-2 ${errors.lastName ? "ring-red-500" : "focus:ring-primary"
                }`}
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300 flex items-center gap-2">
              <FaEnvelope className="text-primary" /> Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={`w-full px-4 py-3 rounded-md bg-[#2b2b2b] text-white placeholder-gray-500 outline-none focus:ring-2 ${errors.email ? "ring-red-500" : "focus:ring-primary"
                }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-300 flex items-center gap-2">
              <FaPhone className="text-primary" /> Phone Number
            </label>
            <div className="flex items-center">
              <span className="px-3 py-3 bg-[#2b2b2b] border-r border-gray-600 rounded-l-md text-gray-400">
                +44
              </span>
              <input
                type="tel"
                placeholder="Enter your phone number"
                {...register("phone")}
                className={`w-full px-4 py-3 rounded-r-md bg-[#2b2b2b] text-white placeholder-gray-500 outline-none focus:ring-2 ${errors.phone ? "ring-red-500" : "focus:ring-primary"
                  }`}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300 flex items-center gap-2">
              <FaLock className="text-primary" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={`w-full px-4 py-3 rounded-md bg-[#2b2b2b] text-white placeholder-gray-500 outline-none focus:ring-2 ${errors.password ? "ring-red-500" : "focus:ring-primary"
                  }`}
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FaEye />
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Postal Code */}
          {/* <div className="space-y-1"> */}
          {/*   <label className="text-sm text-gray-300 flex items-center gap-2"> */}
          {/*     <FaMapMarkerAlt className="text-primary" /> Postal Code */}
          {/*   </label> */}
          {/*   <input */}
          {/*     type="text" */}
          {/*     placeholder="Enter your postal code" */}
          {/*     {...register("postalCode")} */}
          {/*     className={`w-full px-4 py-3 rounded-md bg-[#2b2b2b] text-white placeholder-gray-500 outline-none focus:ring-2 ${errors.postalCode ? "ring-red-500" : "focus:ring-primary" */}
          {/*       }`} */}
          {/*   /> */}
          {/*   {errors.postalCode && ( */}
          {/*     <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p> */}
          {/*   )} */}
          {/* </div> */}

          {/* Sign Up Button */}
          <button
            type="submit"
            className={`w-full font-semibold py-3 rounded-md flex items-center justify-center gap-2 ${isLoading
              ? "bg-black text-white cursor-not-allowed"
              : "bg-primary text-black hover:bg-primary/90"
              }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span>
                <l-zoomies size="80" stroke="5" bg-opacity="0.1" speed="1.4" color="yellow"></l-zoomies>
              </span>
            ) : (
              <span className="inline-flex items-center">
                <FaUserPlus className="mr-2" /> Sign Up
              </span>
            )}
          </button>
          <h1 className="text-center text-sm text-red-500">{errorMsg}</h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm mt-4">
            <hr className="flex-1 border-gray-600" />
            Or continue with
            <hr className="flex-1 border-gray-600" />
          </div>

          {/* Social Buttons */}
          <div className="flex gap-4">
            <button onClick={() => googleSignup()}
              className="w-full bg-[#2b2b2b] hover:bg-[#3b3b3b] py-2 rounded-md flex items-center justify-center gap-2 border border-gray-600 text-white"
            >
              <FaGoogle /> Google
            </button>
            {/* <button className="w-full bg-[#2b2b2b] hover:bg-[#3b3b3b] py-2 rounded-md flex items-center justify-center gap-2 border border-gray-600"> */}
            {/*   <FaApple /> Apple */}
            {/* </button> */}
          </div>

          {/* Sign up */}
          <div className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <Link to="/userlogin" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div >
  );
}
