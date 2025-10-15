import React, { useState, useEffect } from "react";
import { Upload, User, Plus, Trash2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function UserEditProfile() {
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    phoneVerified: false,
    address: {
      Building_No: "",
      Street: "",
      Locality: "",
      PostTown: "",
      PostalCode: "",
    },
    allAddresses: [],
  });

  const [newAddress, setNewAddress] = useState({
    Building_No: "",
    Street: "",
    Locality: "",
    PostTown: "",
    PostalCode: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const userjwt = localStorage.getItem("userjwt");

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${apiUrl}/user/profile`, {
          headers: { Authorization: `Bearer ${userjwt}` },
        });
        const u = res.data.user || {};

        setForm({
          firstName: u.name?.first || "",
          lastName: u.name?.last || "",
          email: u.email || "",
          phone: u.phone || "",
          gender: u.gender || "",
          phoneVerified: u.phoneVerified || false,
          address: {
            Building_No: u.address?.Building_No || "",
            Street: u.address?.Street || "",
            Locality: u.address?.Locality || "",
            PostTown: u.address?.PostTown || "",
            PostalCode: u.address?.PostalCode || "",
          },
          allAddresses: u.allAddresses || [],
        });

        if (u.avatar_url) setPreviewUrl(u.avatar_url);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl, id]);

  const handleChange = (field, value, nested = false) => {
    if (nested) {
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  // <-- FIX: define handleNewAddressChange
  const handleNewAddressChange = (field, value) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddAddress = () => {
    // trim required fields
    const trimmed = {
      Building_No: (newAddress.Building_No || "").trim(),
      Street: (newAddress.Street || "").trim(),
      Locality: (newAddress.Locality || "").trim(),
      PostTown: (newAddress.PostTown || "").trim(),
      PostalCode: (newAddress.PostalCode || "").trim(),
    };

    if (!trimmed.Building_No || !trimmed.Street || !trimmed.PostalCode) {
      toast.error("Building No, Street & Postal Code are required");
      return;
    }

    // Prevent exact duplicates (building, street, postal)
    const duplicate = form.allAddresses.some(
      (a) =>
        (a.Building_No || "").trim() === trimmed.Building_No &&
        (a.Street || "").trim() === trimmed.Street &&
        (a.PostalCode || "").trim() === trimmed.PostalCode
    );
    if (duplicate) {
      toast.error("This address is already saved");
      return;
    }

    setForm((prev) => ({
      ...prev,
      allAddresses: [...prev.allAddresses, { ...trimmed }],
    }));
    setNewAddress({
      Building_No: "",
      Street: "",
      Locality: "",
      PostTown: "",
      PostalCode: "",
    });
    toast.success("Address added");
  };

  const handleSetCurrentAddress = (addr) => {
    setForm((prev) => ({ ...prev, address: { ...addr } }));
    toast.success("Current address updated");
  };

  const handleRemoveAddress = (idx) => {
    setForm((prev) => ({
      ...prev,
      allAddresses: prev.allAddresses.filter((_, i) => i !== idx),
    }));
    toast.success("Address removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name[first]", form.firstName);
      formData.append("name[last]", form.lastName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("gender", form.gender);

      Object.entries(form.address).forEach(([k, v]) => {
        formData.append(`address[${k}]`, v);
      });

      form.allAddresses.forEach((addr, i) => {
        Object.entries(addr).forEach(([k, v]) => {
          formData.append(`allAddresses[${i}][${k}]`, v);
        });
      });

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      await axios.put(`${apiUrl}/user/editprofile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userjwt}`,
        },
      });

      toast.success("Profile updated successfully!");
      navigate("/user/userprofile");
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading profile...
      </div>
    );
  }

  // Derived boolean for Add button disabled state
  const addDisabled =
    !newAddress.Building_No.trim() ||
    !newAddress.Street.trim() ||
    !newAddress.PostalCode.trim();

  return (
    <div className="bg-black text-white min-h-screen p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Edit Profile</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-black rounded-xl p-6 shadow-lg w-full mx-auto"
      >
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-black border border-white/20 flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-2xl" />
            )}
          </div>
          <label className="flex items-center gap-2 px-3 py-1.5 text-sm bg-black border border-white/20 hover:bg-[#111] rounded-lg cursor-pointer">
            <Upload size={16} /> Upload Avatar
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* First + Last name */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary"
            />
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled // 👈 disable only email


            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white disabled:cursor-not-allowed disabled:opacity-50 focus:border-primary"
              disabled={form.phoneVerified}   // 👈 disable ONLY if verified
            />
          </div>
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Gender</label>
          <select
            value={form.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* New Address Section */}
        {/* <div className="mb-6"> */}
        {/*   <h3 className="text-lg font-semibold text-primary mb-2">Add New Address</h3> */}
        {/*   <div className="grid grid-cols-2 gap-4"> */}
        {/*     {[ */}
        {/*       { key: "Building_No", label: "Building No" }, */}
        {/*       { key: "Street", label: "Street" }, */}
        {/*       { key: "Locality", label: "Locality" }, */}
        {/*       { key: "PostTown", label: "Post Town" }, */}
        {/*       { key: "PostalCode", label: "Postal Code" }, */}
        {/*     ].map(({ key, label }) => ( */}
        {/*       <div key={key} className="col-span-1"> */}
        {/*         <label className="block text-sm text-gray-400 mb-1">{label}</label> */}
        {/*         <input */}
        {/*           type="text" */}
        {/*           value={newAddress[key]} */}
        {/*           onChange={(e) => handleNewAddressChange(key, e.target.value)} */}
        {/*           className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary" */}
        {/*         /> */}
        {/*       </div> */}
        {/*     ))} */}
        {/*   </div> */}
        {/*   <button */}
        {/*     type="button" */}
        {/*     onClick={handleAddAddress} */}
        {/*     disabled={addDisabled} */}
        {/*     className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${addDisabled */}
        {/*         ? "bg-gray-700 text-white cursor-not-allowed" */}
        {/*         : "bg-primary text-black hover:opacity-90" */}
        {/*       }`} */}
        {/*   > */}
        {/*     <Plus size={16} /> Add Address */}
        {/*   </button> */}
        {/* </div> */}
        {/**/}
        {/* Saved Addresses */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-primary mb-3">Saved Addresses</h3>
          {form.allAddresses.length === 0 ? (
            <p className="text-sm text-gray-500">No addresses saved yet.</p>
          ) : (
            <div className="grid gap-4">
              {form.allAddresses.map((addr, idx) => (
                <div
                  key={idx}
                  className="relative bg-[#111] p-4 rounded-xl border border-white/10 shadow-sm hover:border-primary/50 transition"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveAddress(idx)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                    aria-label={`Remove address ${idx + 1}`}
                  >
                    {/* <Trash2 size={18} /> */}
                  </button>

                  <div className="text-sm text-gray-300 leading-relaxed mb-2">
                    <p>
                      <span className="font-medium">{addr.Building_No}</span>, {addr.Street}
                    </p>
                    <p>{addr.Locality}, {addr.PostTown}</p>
                    <p>{addr.PostalCode}</p>
                  </div>

                  {/* <button */}
                  {/*   type="button" */}
                  {/*   onClick={() => handleSetCurrentAddress(addr)} */}
                  {/*   className="mt-2 px-3 py-1.5 rounded-lg bg-primary text-black text-xs hover:opacity-90" */}
                  {/* > */}
                  {/*   Set as Current */}
                  {/* </button> */}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Address Preview */}
        {/* <div className="mb-6"> */}
        {/*   <h3 className="text-lg font-semibold text-primary mb-2">Current Address</h3> */}
        {/*   {form.address.Building_No ? ( */}
        {/*     <div className="bg-[#111] p-4 rounded-lg border border-white/10 text-sm text-gray-300"> */}
        {/*       {form.address.Building_No}, {form.address.Street}, {form.address.Locality},{" "} */}
        {/*       {form.address.PostTown}, {form.address.PostalCode} */}
        {/*     </div> */}
        {/*   ) : ( */}
        {/*     <p className="text-sm text-gray-500">No current address selected.</p> */}
        {/*   )} */}
        {/* </div> */}
        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/user/dashboard")}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary text-black font-semibold hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
