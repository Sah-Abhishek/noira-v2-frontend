import React, { useState, useEffect } from "react";
import { Upload, User, ChevronDown, Loader2Icon } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditTherapistProfileAdmin() {
  const [servicesList, setServicesList] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
  const adminjwt = localStorage.getItem("adminjwt");
  const [saving, setSaving] = useState(false);

  const [addressPostcodeSearch, setAddressPostcodeSearch] = useState("");
  const [addressPostcodeSuggestions, setAddressPostcodeSuggestions] = useState([]);
  const [searchingAddressPostcodes, setSearchingAddressPostcodes] = useState(false);

  const londonAreas = [
    "Central London",
    "East London",
    "West London",
    "North London",
    "South London"
  ];

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    experience: "",
    phone: "",
    email: "",
    password: "",
    address: {
      Building_No: "",
      Street: "",
      Locality: "",
      PostTown: "",
      PostalCode: "",
    },
    services: [],
    languages: [],
    servicesInPostalCodes: [],
    active: false,
    gender: "",
    isVerified: false,
    bio: "",
    postcodeSearch: "",
    postcodeSuggestions: [],
    searchingPostcodes: false,
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch services list
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${apiUrl}/services/list`, {
          headers: {
            Authorization: `Bearer ${adminjwt}`,
          },
        });
        setServicesList(res.data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    };
    fetchServices();
  }, [apiUrl]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAreaDropdownOpen && !event.target.closest('.area-dropdown')) {
        setIsAreaDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAreaDropdownOpen]);

  // Address postcode search effect
  useEffect(() => {
    if (addressPostcodeSearch.length < 2) {
      setAddressPostcodeSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearchingAddressPostcodes(true);
      try {
        const res = await axios.get(
          `https://api.postcodes.io/postcodes?q=${addressPostcodeSearch}&limit=50`
        );
        setAddressPostcodeSuggestions(
          res.data?.result?.map((r) => r.postcode) || []
        );
      } catch (err) {
        console.error("Address postcode search failed:", err);
        setAddressPostcodeSuggestions([]);
      } finally {
        setSearchingAddressPostcodes(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [addressPostcodeSearch]);

  // Fetch therapist details
  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const res = await axios.get(`${apiUrl}/therapist/${id}`, {
          headers: {
            Authorization: `Bearer ${adminjwt}`,
          }
        });
        const t = res.data.therapist;

        setForm({
          firstName: t.userId?.name?.first || "",
          lastName: t.userId?.name?.last || "",
          username: t.title || "",
          experience: t.experience || "",
          phone: t.userId?.phone || "",
          email: t.userId?.email || "",
          password: "",
          address: {
            Building_No: t.userId?.address?.Building_No || "",
            Street: t.userId?.address?.Street || "",
            Locality: t.userId?.address?.Locality || "",
            PostTown: t.userId?.address?.PostTown || "",
            PostalCode: t.userId?.address?.PostalCode || "",
          },
          services: t.specializations?.map((s) => s._id) || [],
          languages: t.languages || [],
          servicesInPostalCodes: t.servicesInPostalCodes || [],
          active: t.active || false,
          gender: t.userId?.gender || "",
          isVerified: t.isVerified || false,
          bio: t.bio || "",
          postcodeSearch: "",
          postcodeSuggestions: [],
          searchingPostcodes: false,
        });
        console.log("These are the services: ", form.services);

        // Set address postcode search to match the current address postcode
        setAddressPostcodeSearch(t.userId?.address?.PostalCode || "");

        if (t.userId?.avatar_url) {
          setPreviewUrl(t.userId.avatar_url);
        }
      } catch (err) {
        console.error("Failed to fetch therapist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTherapist();
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAreaSelect = (area) => {
    if (!form.servicesInPostalCodes.includes(area)) {
      setForm((prev) => ({
        ...prev,
        servicesInPostalCodes: [...prev.servicesInPostalCodes, area],
      }));
    }
    setIsAreaDropdownOpen(false);
  };

  const removeArea = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      servicesInPostalCodes: prev.servicesInPostalCodes.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that at least one area is selected
    if (form.servicesInPostalCodes.length === 0) {
      toast.error("Please select at least one area in which you provide your services.");
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "address") {
          Object.entries(value).forEach(([k, v]) =>
            formData.append(`address[${k}]`, v)
          );
        } else if (key === "services") {
          value.forEach((v) => formData.append("services[]", v));
        } else if (key === "username") {
          formData.append("title", value);
        } else if (key === "acceptingNewClients") {
          formData.append("active", value);
        } else if (Array.isArray(value)) {
          value.forEach((v) => formData.append(`${key}[]`, v));
        } else if (!["postcodeSearch", "postcodeSuggestions", "searchingPostcodes"].includes(key)) {
          formData.append(key, value);
        }
      });
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      await axios.put(`${apiUrl}/admin/updatetherapist/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${adminjwt}`
        },
      });

      toast.success("Therapist updated successfully!");
      navigate("/admin/therapistmanagement");
    } catch (err) {
      console.error("Error updating therapist:", err);
      toast.error("Failed to update therapist.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading therapist profile...
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">
          Edit Therapist Profile
        </h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-black rounded-xl p-6 shadow-lg w-full mx-auto"
      >
        {/* Profile Picture */}
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
            <Upload size={16} /> Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* First Name + Last Name + Username */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary"
              required
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
          <div>
            <label className="block text-sm text-gray-400 mb-1">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary"
              required
            />
          </div>
        </div>

        {/* Phone + Email */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary"
              required
            />
          </div>
        </div>

        {/* Experience */}
        <label className="block text-sm text-gray-400 mb-1">Experience</label>
        <input
          type="number"
          value={form.experience}
          onChange={(e) => handleChange("experience", e.target.value)}
          className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary mb-4"
          placeholder="Years of experience"
        />

        {/* Address */}
        <label className="block text-sm text-gray-400 mb-2">Address</label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {["Building_No", "Street", "Locality", "PostTown"].map(
            (field) => (
              <input
                key={field}
                type="text"
                placeholder={field}
                value={form.address[field]}
                onChange={(e) => handleChange(field, e.target.value, true)}
                className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary"
              />
            )
          )}
          {/* PostalCode with search */}
          <div className="relative">
            <input
              type="text"
              placeholder="PostalCode"
              value={addressPostcodeSearch}
              onChange={(e) => {
                setAddressPostcodeSearch(e.target.value);
              }}
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary"
            />

            {/* Loader */}
            {searchingAddressPostcodes && (
              <div className="absolute mt-1 w-full bg-black border border-white/10 rounded-lg p-2 flex items-center gap-2 text-gray-400 text-sm">
                <Loader2Icon className="w-4 h-4 animate-spin" /> Searching...
              </div>
            )}

            {/* Suggestions */}
            {!searchingAddressPostcodes &&
              addressPostcodeSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-black border border-white/10 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                  {addressPostcodeSuggestions.map((pc) => (
                    <button
                      key={pc}
                      type="button"
                      onClick={() => {
                        handleChange("PostalCode", pc, true);
                        setAddressPostcodeSearch(pc);
                        setAddressPostcodeSuggestions([]);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors text-white"
                    >
                      {pc}
                    </button>
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* Services Offered */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">
            Services Offered
          </label>
          <div className="grid grid-cols-2 gap-2">
            {servicesList.map((service) => {
              const isChecked = form.services.includes(service._id);
              return (
                <label
                  key={service._id}
                  className={`flex items-center gap-3 cursor-pointer rounded-lg border px-3 py-2 transition-all
            ${isChecked
                      ? "border-primary bg-primary/10"
                      : "border-white/10 hover:border-primary/50"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() =>
                      handleChange(
                        "services",
                        isChecked
                          ? form.services.filter((s) => s !== service._id)
                          : [...form.services, service._id]
                      )
                    }
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all
              ${isChecked
                        ? "bg-primary text-black"
                        : "bg-black border border-white/20"
                      }`}
                  >
                    {isChecked && (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm">{service.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Services Available in Postcodes */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">
            Services Available in Postcodes
          </label>

          <div className="relative mb-3 area-dropdown">
            <input
              type="text"
              placeholder="Enter postcode to add service area..."
              value={form.postcodeSearch || ""}
              onChange={async (e) => {
                const value = e.target.value;
                handleChange("postcodeSearch", value);

                if (value.length < 2) {
                  setForm((prev) => ({ ...prev, postcodeSuggestions: [] }));
                  return;
                }

                setForm((prev) => ({ ...prev, searchingPostcodes: true }));
                try {
                  const res = await axios.get(
                    `${apiUrl}/outcodes?q=${value}&limit=50`
                  );
                  setForm((prev) => ({
                    ...prev,
                    postcodeSuggestions: res.data?.result?.map((r) => r.postcode) || [],
                  }));
                } catch (err) {
                  console.error("Postcode search failed:", err);
                  setForm((prev) => ({ ...prev, postcodeSuggestions: [] }));
                } finally {
                  setForm((prev) => ({ ...prev, searchingPostcodes: false }));
                }
              }}
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary"
            />

            {/* Loader + Suggestions */}
            {form.searchingPostcodes && (
              <div className="absolute mt-1 w-full bg-black border border-white/10 rounded-lg p-2 text-gray-400 text-sm">
                Searching...
              </div>
            )}
            {!form.searchingPostcodes &&
              form.postcodeSuggestions &&
              form.postcodeSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-black border border-white/10 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                  {form.postcodeSuggestions.map((pc) => (
                    <button
                      key={pc}
                      type="button"
                      onClick={() => {
                        // Add to service areas if not already present
                        if (!form.servicesInPostalCodes.includes(pc)) {
                          handleChange("servicesInPostalCodes", [...form.servicesInPostalCodes, pc]);
                        }
                        // Clear search
                        handleChange("postcodeSearch", "");
                        setForm((prev) => ({ ...prev, postcodeSuggestions: [] }));
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors text-white"
                    >
                      {pc}
                    </button>
                  ))}
                </div>
              )}
          </div>

          {/* Selected Postcodes */}
          <div className="flex flex-wrap gap-2">
            {form.servicesInPostalCodes.map((pc, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full border border-white/10 bg-primary/10 text-sm flex items-center gap-2"
              >
                {pc}
                <button
                  type="button"
                  onClick={() => {
                    handleChange(
                      "servicesInPostalCodes",
                      form.servicesInPostalCodes.filter((_, i) => i !== index)
                    );
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Accepting New Clients */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Accepting New Clients
            </label>
            <div className="flex gap-2">
              {["Yes", "No"].map((option) => {
                const isActive =
                  (option === "Yes" && form.active) ||
                  (option === "No" && !form.active);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleChange("active", option === "Yes")}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all
            ${isActive
                        ? "bg-primary text-black border-primary"
                        : "bg-black border-white/10 text-white hover:border-primary/50"
                      }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gender */}
          <div>
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
        </div>

        {/* Verified Therapist */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">
            Verified Therapist
          </label>
          <div className="flex gap-2">
            {["Yes", "No"].map((option) => {
              const isActive =
                (option === "Yes" && form.isVerified) ||
                (option === "No" && !form.isVerified);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleChange("isVerified", option === "Yes")}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all
                    ${isActive
                      ? "bg-primary text-black border-primary"
                      : "bg-black border-white/10 text-white hover:border-primary/50"
                    }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Languages */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Languages</label>
          <input
            type="text"
            placeholder="Comma separated (e.g., English, Spanish)"
            value={form.languages.join(", ")}
            onChange={(e) =>
              handleChange(
                "languages",
                e.target.value.split(",").map((l) => l.trim())
              )
            }
            className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary"
          />
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1">Short Bio</label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/therapistmanagement")}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 rounded-lg font-semibold transition-all
    ${saving
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-primary text-black hover:opacity-90"
              }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
