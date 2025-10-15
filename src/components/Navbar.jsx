import React, { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import noira from "/noira.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(true); // Mock theme state
  const navigate = useNavigate();
  const userjwt = localStorage.getItem("userjwt");
  const isActive = (path) => location.pathname === path;

  // Instead of userEmail mock, decide login status by jwt
  const isLoggedIn = Boolean(userjwt);
  const userEmail = null; // Mock user state


  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLinkClick = (href, state = {}) => {
    navigate(href, { state });
    setIsOpen(false);
  };

  return (
    <nav
      className={`z-50 fixed top-4 left-1/2 transform -translate-x-1/2 
        px-3 sm:px-4 md:px-6 py-2 flex justify-between items-center 
        backdrop-blur-md bg-opacity-40 shadow-lg rounded-full 
        transition-all duration-300 
        ${isDarkMode ? "bg-[#111]/60 text-white" : "bg-white/60 text-black"} 
        max-w-6xl w-[95%] sm:w-[90%]`}
    >
      {/* Logo */}
      <Link to="/">
        <div className="flex items-center h-10">
          <img src={noira} alt="Logo" className="h-20 sm:h-25" />
        </div>
      </Link>

      {/* Hamburger Icon - Mobile & Tablet */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="xl:hidden focus:outline-none z-50 relative"
      >
        {isOpen ? (
          <X className="text-[#95793e] w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Menu className="text-[#95793e] w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </button>

      {/* Desktop Nav - Only visible on XL screens */}
      <div className="hidden xl:flex gap-6 text-sm items-center">
        <button onClick={() => handleLinkClick("/")}
          className={`hover:text-primary transition ${isActive("/") ? "text-[#C49E5B] font-semibold" : ""}`}
        >
          Home
        </button>
        <button onClick={() => handleLinkClick("/allservicespage")}
          className={`hover:text-primary transition ${isActive("/allservicespage") ? "text-[#C49E5B] font-semibold" : ""}`}
        >
          Services
        </button>
        <button onClick={() => handleLinkClick("/browsetherapists")}
          className={`hover:text-primary transition ${isActive("/browsetherapists") ? "text-[#C49E5B] font-semibold" : ""}`}
        >
          Therapists
        </button>
        <button onClick={() => handleLinkClick("/about")}
          className={`hover:text-primary transition ${isActive("/about") ? "text-[#C49E5B] font-semibold" : ""}`}
        >
          About
        </button>
        <button onClick={() => handleLinkClick("/careers")}
          className={`hover:text-primary transition ${isActive("/careers") ? "text-[#C49E5B] font-semibold" : ""}`}
        >
          Careers
        </button>
        <button onClick={() => handleLinkClick("/blog")}
          className={`hover:text-primary transition ${isActive("/blog") ? "text-[#C49E5B] font-semibold" : ""}`}
        >
          Blog
        </button>

        {!isLoggedIn ? (
          <div className="">
            <button
              onClick={() => handleLinkClick("/userlogin", { state: { from: location } })}
              className="px-4 m-2 py-2 rounded-full bg-primary text-black font-medium hover:bg-opacity-80 transition"
            >
              Login
            </button>
            <button
              onClick={() => handleLinkClick("/adminlogin", { state: { from: location } })}
              className="px-4 py-2 rounded-full bg-primary text-black font-medium hover:bg-opacity-80 transition"
            >
              Admin
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="group inline-block">
              <button
                className="px-4 py-2 rounded-full text-white font-medium transition flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 
            0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 
            0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 
            9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-32 
    bg-[#0d0d0d]/90 backdrop-blur-md rounded-lg shadow-lg 
    opacity-0 group-hover:opacity-100 invisible group-hover:visible 
    transition-all duration-200">
                <button
                  onClick={() => navigate("/user/userprofile")}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#C49E5B]/20 rounded-t-lg transition"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("userjwt"); // logout
                    navigate("/"); // redirect home
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#C49E5B]/20 rounded-b-lg transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile & Tablet Nav Menu */}
      {/* Mobile & Tablet Nav Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm xl:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Content */}
          <div
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md
        rounded-2xl backdrop-blur-md bg-opacity-95 shadow-xl
        px-6 py-6 flex flex-col gap-4 xl:hidden transition-all duration-300 z-50
        ${isDarkMode ? "bg-[#111] text-white border border-white/10" : "bg-white text-black border border-black/10"}`}
          >
            {/* Navigation Links */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleLinkClick("/")}
                className="text-base font-medium hover:text-primary transition px-2 py-1 text-left"
              >
                Home
              </button>
              <button
                onClick={() => handleLinkClick("/allservicespage")}
                className="text-base font-medium hover:text-primary transition px-2 py-1 text-left"
              >
                Services
              </button>
              <button
                onClick={() => handleLinkClick("/browsetherapists", { state: { from: '/browsetherapists' } })}
                className="text-base font-medium hover:text-[#C49E5B] transition px-2 py-1 text-left"
              >
                Therapists
              </button>
              <button
                onClick={() => handleLinkClick("/about")}
                className="text-base font-medium hover:text-primary transition px-2 py-1 text-left"
              >
                About
              </button>
              <button
                onClick={() => handleLinkClick("/careers")}
                className="text-base font-medium hover:text-primary transition px-2 py-1 text-left"
              >
                Careers
              </button>
              {/* <button */}
              {/*   onClick={() => handleLinkClick("/cart")} */}
              {/*   className="text-base font-medium hover:text-primary transition px-2 py-1 flex items-center gap-2" */}
              {/* > */}
              {/*   <ShoppingBag className="w-5 h-5" /> */}
              {/*   <span>Cart</span> */}
              {/* </button> */}
            </div>

            {/* Divider */}
            <div className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-300"} my-2`} />

            {/* Login / Profile for Mobile */}
            {isLoggedIn ? (
              <div className="relative group">
                <button onClick={() => navigate("/user/userprofile")} className="w-full px-4 py-3 rounded-xl text-white font-medium flex items-center justify-center transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 
                0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 
                0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 
                9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </button>

                {/* Dropdown */}
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-32 
              bg-black/50 backdrop-blur-md rounded-lg shadow-lg 
              opacity-0 group-hover:opacity-100 invisible group-hover:visible 
              transition-all duration-200 z-50">
                  <button
                    onClick={() => navigate("/userprofile")}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#C49E5B]/20 rounded-t-lg transition"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("userjwt");
                      navigate("/");
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#C49E5B]/20 rounded-b-lg transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="">
                <button
                  onClick={() => handleLinkClick("/userlogin", { state: { from: location } })}
                  className="w-full my-2 px-4 py-3 rounded-xl bg-primary text-black font-medium hover:bg-opacity-80 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => handleLinkClick("/adminlogin", { state: { from: location } })}
                  className="w-full px-4 py-3 rounded-xl bg-primary text-black font-medium hover:bg-opacity-80 transition"
                >
                  Admin
                </button>
              </div>

            )}
          </div>
        </>
      )}
    </nav >
  );
};

export default Navbar;
