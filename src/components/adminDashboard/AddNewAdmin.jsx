
import React, { useState } from "react";
import { Mail, User, Lock, ChevronDown } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const apiUrl = import.meta.env.VITE_API_URL;

export default function AddAdminPage() {
  const [formData, setFormData] = useState({
    email: "",
    first: "",
    last: "",
    gender: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const adminjwt = localStorage.getItem("adminjwt");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${apiUrl}/admin/create`,
        formData,
        { headers: { Authorization: `Bearer ${adminjwt}` } }
      );

      if (res.status === 201) {
        toast.success("New admin created successfully!");
        setFormData({ email: "", first: "", last: "", gender: "", password: "" });
      }
    } catch (err) {
      console.error("Error creating admin:", err);
      toast.error(err.response?.data?.message || "Failed to create admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-[#111] rounded-2xl shadow-xl p-8 text-white border border-gray-800">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          Create New Admin
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#0d0d0d] border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="text"
                name="first"
                value={formData.first}
                onChange={handleChange}
                required
                className="w-full bg-[#0d0d0d] border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="text"
                name="last"
                value={formData.last}
                onChange={handleChange}
                required
                className="w-full bg-[#0d0d0d] border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Gender</label>
            <div className="relative">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full appearance-none bg-[#0d0d0d] border border-gray-700 rounded-lg pl-3 pr-8 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-[#0d0d0d] border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setFormData({ email: "", first: "", last: "", gender: "", password: "" })}
              className="px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-800 transition"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-primary text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
