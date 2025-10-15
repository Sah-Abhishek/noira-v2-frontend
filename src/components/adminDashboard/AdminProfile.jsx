import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Edit, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminListPage from "../Admin/AdminList";

const apiUrl = import.meta.env.VITE_API_URL;

function AddAdminForm({ onClose }) {
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
        `${apiUrl}/admin/createadmin`,
        formData,
        { headers: { Authorization: `Bearer ${adminjwt}` } }
      );

      if (res.status === 201) {
        toast.success("New admin created successfully!");
        setFormData({ email: "", first: "", last: "", gender: "", password: "" });
        onClose(); // close form after success
      }
    } catch (err) {
      console.error("Error creating admin:", err);
      toast.error(err.response?.data?.message || "Failed to create admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111] rounded-2xl shadow-xl p-8 text-white border border-gray-800 mt-6">
      <h2 className="text-xl font-bold text-primary mb-6 text-center">
        Create New Admin
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-[#0d0d0d] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">First Name</label>
          <input
            type="text"
            name="first"
            value={formData.first}
            onChange={handleChange}
            required
            className="w-full bg-[#0d0d0d] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Last Name</label>
          <input
            type="text"
            name="last"
            value={formData.last}
            onChange={handleChange}
            required
            className="w-full bg-[#0d0d0d] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full bg-[#0d0d0d] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full bg-[#0d0d0d] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-800 transition"
          >
            Cancel
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
  );
}

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const adminjwt = localStorage.getItem("adminjwt");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${apiUrl}/admin/profile`, {
          headers: { Authorization: `Bearer ${adminjwt}` },
        });
        setUser(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch admin profile");
      } finally {
        setLoading(false);
      }
    };

    if (adminjwt) {
      fetchProfile();
    } else {
      setError("Admin not authenticated");
      setLoading(false);
    }
  }, [adminjwt]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-primary">
        <p className="animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  const fullName = `${user?.name?.first || ""} ${user?.name?.last || ""}`;

  return (
    <div className="min-h-screen bg-[#0d0d0d] py-10 px-4 text-gray-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-[#111] rounded-2xl p-8 shadow-lg flex flex-col items-center text-center border border-gray-800">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-primary object-cover shadow-md"
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center rounded-full border-4 border-primary bg-[#0d0d0d]">
                <User size={56} className="text-gray-500" />
              </div>
            )}

            <h2 className="mt-4 text-2xl font-bold text-primary">{fullName}</h2>
            <p className="text-gray-400 mt-1 capitalize">
              {user.gender || "Not specified"}
            </p>

            <div className="mt-6 w-full text-left space-y-2 text-sm">
              <p>
                <span className="font-semibold text-gray-300">Email:</span>{" "}
                {user.email}
              </p>
              <p>
                <span className="font-semibold text-gray-300">Last Sign-in:</span>{" "}
                {new Date(user.lastSignInAt).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/admineditprofile")}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-black py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              <Edit size={16} /> Edit Profile
            </button>

            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 w-full flex items-center justify-center gap-2 border border-primary text-primary py-2 rounded-lg font-semibold hover:bg-primary hover:text-black transition"
            >
              <Plus size={16} /> Add New Admin
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-[#111] rounded-2xl p-6 shadow-lg border border-gray-800">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Profile Overview
            </h3>
            <p className="text-gray-400 text-sm">
              This is where you can add extended admin information such as
              activity stats, addresses, and more.
            </p>
          </div>

          {/* Add Admin Form */}
          {showAddForm && (
            <AddAdminForm onClose={() => setShowAddForm(false)} />
          )}

          {/* Admin List Section */}
          <div className="bg-[#111] rounded-2xl p-6 shadow-lg border border-gray-800">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Admin List
            </h3>
            <div>
              <AdminListPage />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
