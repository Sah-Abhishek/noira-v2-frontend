import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export default function AdminEditProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const adminjwt = localStorage.getItem("adminjwt");
  const navigate = useNavigate();

  // For address postcode
  const [addressPostcodeQuery, setAddressPostcodeQuery] = useState("");
  const [addressPostcodeOptions, setAddressPostcodeOptions] = useState([]);
  const [isAddressSearching, setIsAddressSearching] = useState(false);

  // For servicesInPostalCodes
  const [postcodeQuery, setPostcodeQuery] = useState("");
  const [postcodeOptions, setPostcodeOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);


  const fetchPostcodes = async (query, setOptions, setLoading) => {
    if (!query.trim()) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.postcodes.io/postcodes?q=${query}&limit=50`
      );
      setOptions(res.data?.result || []);
    } catch (err) {
      console.error("Error fetching postcodes:", err);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };
  const handleAddressPostcodeSelect = (postcode) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, PostalCode: postcode },
    }));
    setAddressPostcodeQuery("");
    setAddressPostcodeOptions([]);
  };

  const handleServicePostcodeSelect = (postcode) => {
    if (!formData.servicesInPostalCodes?.includes(postcode)) {
      setFormData((prev) => ({
        ...prev,
        servicesInPostalCodes: [...(prev.servicesInPostalCodes || []), postcode],
      }));
    }
    setPostcodeQuery("");
    setPostcodeOptions([]);
  };

  const removeServicePostcode = (postcode) => {
    setFormData((prev) => ({
      ...prev,
      servicesInPostalCodes: prev.servicesInPostalCodes.filter((p) => p !== postcode),
    }));
  };



  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPostcodes(addressPostcodeQuery, setAddressPostcodeOptions, setIsAddressSearching);
    }, 400);
    return () => clearTimeout(delay);
  }, [addressPostcodeQuery]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPostcodes(postcodeQuery, setPostcodeOptions, setIsSearching);
    }, 400);
    return () => clearTimeout(delay);
  }, [postcodeQuery]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${apiUrl}/admin/profile`, {
          headers: { Authorization: `Bearer ${adminjwt}` },
        });
        setProfile(res.data.user);
        setFormData(res.data.user);
        setPreviewUrl(res.data.user.avatar_url);
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      // append fields
      data.append("email", formData.email || "");
      data.append("gender", formData.gender || "");
      data.append("role", formData.role || "");
      data.append("first", formData?.name?.first || "");
      data.append("last", formData?.name?.last || "");

      if (avatarFile) {
        data.append("profileImage", avatarFile);
      }


      const response = await axios.put(`${apiUrl}/admin/editprofile`, data, {
        headers: {
          Authorization: `Bearer ${adminjwt}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status == 200) {
        toast.success("Profile updated successfully!");
        navigate('/admin/adminprofile')

      }
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-primary">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-2xl bg-[#111] rounded-2xl shadow-lg p-8 text-white">
        {/* Header */}
        <div className="flex flex-col items-center space-y-3 mb-6">
          <div className="relative">
            <img
              src={previewUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-2 border-primary shadow-md object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-primary text-black rounded-full p-2 cursor-pointer hover:opacity-90">
              <Upload size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          <h2 className="text-2xl font-bold text-primary">Edit Profile</h2>
          <p className="text-gray-400 text-sm">
            Update your profile details below
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="text"
                name="first"
                value={formData?.name?.first || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: { ...prev.name, first: e.target.value },
                  }))
                }
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
                value={formData?.name?.last || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: { ...prev.name, last: e.target.value },
                  }))
                }
                className="w-full bg-[#0d0d0d] border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="email"
                name="email"
                value={formData?.email || ""}
                onChange={handleChange}
                className="w-full bg-[#0d0d0d] border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Gender</label>
            <select
              name="gender"
              value={formData?.gender || ""}
              onChange={handleChange}
              className="w-full bg-[#0d0d0d] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Role (read-only) */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Role</label>
            <input
              type="text"
              value={formData?.role || ""}
              disabled
              className="w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button onClick={() => navigate('/admin/adminprofile')}
              type="button"
              className="px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary text-black font-semibold hover:opacity-90 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
