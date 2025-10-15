import React, { useState } from "react";
import "../index.css";
import { zoomies } from "ldrs";
zoomies.register();
import noira from "/noira.png";
import {
  FaUserMd,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaSignInAlt,
  FaGoogle,
  FaApple,
} from "react-icons/fa";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../store/UserStore";

// Validation schema
const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
});

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("therapist");
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const { user, setUser } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const endpoint = `${apiUrl}/auth/${role}/login`;
    const payload = {
      ...data,
      role: role,
    };

    try {
      setIsLoading(true);
      const response = await axios.post(endpoint, payload);

      if (response.status == 200) {
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem(`${role}jwt`, response.data.token)
        localStorage.setItem(`${role}Id`, response.data.therapistId);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("firstname", response.data.name.first);
        setUser(response.data.therapist?.userId);


        console.log("This is the token: ", response.data);
        navigate(`/${role}/${role}dashboard`);
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(`Login failed: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        setErrorMsg("No response from server. Please try again later.");
      } else {
        setErrorMsg(`Error: ${error.message}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#1c1c1c] rounded-xl shadow-lg p-8 space-y-6 relative">
        {/* Logo and Title */}
        <div className="flex flex-col items-center">
          <Link to='/' >
            <img src={noira} alt="Logo" className="h-10 sm:h-12 mb-2" />
            <p className="text-gray-400 font-medium">Wellness Platform</p>
          </Link>
        </div>

        {/* Role Tabs */}
        <div className="flex w-full bg-[#2b2b2b] rounded-lg overflow-hidden mt-4">
          <button
            className={`w-1/2 py-2 text-sm font-medium flex items-center justify-center gap-2 ${role === "therapist" ? "bg-primary text-black" : "text-gray-400"
              }`}
            onClick={() => setRole("therapist")}
          >
            <FaUserMd /> Therapist
          </button>
          <button
            className={`w-1/2 py-2 text-sm font-medium flex items-center justify-center gap-2 ${role === "admin" ? "bg-primary text-black" : "text-gray-400"
              }`}
            onClick={() => setRole("admin")}
          >
            <FaUser /> Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300 flex items-center gap-2">
              <span className="text-primary">
                <FaEnvelope />
              </span>{" "}
              Email Address
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

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300 flex items-center gap-2">
              <span className="text-primary">
                <FaLock />
              </span>{" "}
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={`w-full px-4 py-3 rounded-md bg-[#2b2b2b] text-white placeholder-gray-500 outline-none focus:ring-2 ${errors.password ? "ring-red-500" : "focus:ring-yellow-500"
                  }`}
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FaEye />
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password */}
          {/* <div className="text-right"> */}
          {/*   <a href="#" className="text-sm text-yellow-400 hover:underline"> */}
          {/*     Forgot Password? */}
          {/*   </a> */}
          {/* </div> */}

          {/* Sign In Button */}
          <button
            type="submit"
            className={`w-full font-semibold py-3 rounded-md flex items-center justify-center gap-2 transition ${isLoading
              ? "bg-black text-white cursor-not-allowed"
              : "bg-primary hover:bg-amber-500 text-black"
              }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <l-zoomies
                size="80"
                stroke="5"
                bg-opacity="0.1"
                speed="1.4"
                color="yellow"
              ></l-zoomies>
            ) : (
              <span className="inline-flex items-center">
                <FaSignInAlt className="mr-2" />
                Sign In
              </span>
            )}
          </button>
          <h1 className="text-center text-sm text-red-500">{errorMsg}</h1>
        </form>

        {/* Or Divider */}
        {/* <div className="flex items-center gap-2 text-gray-400 text-sm"> */}
        {/*   <hr className="flex-1 border-gray-600" /> */}
        {/*   Or continue with */}
        {/*   <hr className="flex-1 border-gray-600" /> */}
        {/* </div> */}
        {/**/}
        {/* <div className="flex gap-4"> */}
        {/*   <button className="w-full bg-[#2b2b2b] hover:bg-[#3b3b3b] py-2 rounded-md flex items-center justify-center gap-2 border border-gray-600 text-white"> */}
        {/*     <FaGoogle /> Google */}
        {/*   </button> */}
        {/*   <button className="w-full bg-[#2b2b2b] hover:bg-[#3b3b3b] py-2 rounded-md flex items-center justify-center gap-2 border border-gray-600 text-white"> */}
        {/*     <FaApple /> Apple */}
        {/*   </button> */}
        {/* </div> */}

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pt-6 space-y-2">
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Support
            </a>
          </div>
          <div>
            Need help? Contact us at{" "}
            <a href="mailto:support@noira.com" className="text-primary">
              support@noira.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
