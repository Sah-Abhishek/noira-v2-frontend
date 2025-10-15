import React, { useState, useEffect } from "react";
import { Eye, Upload, User, ChevronDown } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddNewTherapist() {
  const [servicesList, setServicesList] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
  const adminjwt = localStorage.getItem("adminjwt");

  // Add these states at the top with other useStates
  const [postcodeQuery, setPostcodeQuery] = useState("");
  const [postcodeOptions, setPostcodeOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Address postcode search
  const [addressPostcodeQuery, setAddressPostcodeQuery] = useState("");
  const [addressPostcodeOptions, setAddressPostcodeOptions] = useState([]);
  const [isAddressSearching, setIsAddressSearching] = useState(false);


  useEffect(() => {
    if (!addressPostcodeQuery.trim()) {
      setAddressPostcodeOptions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setIsAddressSearching(true);
        const res = await axios.get(
          `https://api.postcodes.io/postcodes?q=${addressPostcodeQuery}&limit=50`
        );
        setAddressPostcodeOptions(res.data?.result || []);
      } catch (err) {
        console.error("Error fetching address postcodes:", err);
        setAddressPostcodeOptions([]);
      } finally {
        setIsAddressSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [addressPostcodeQuery]);

  const handleAddressPostcodeSelect = (postcode) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, PostalCode: postcode },
    }));
    setAddressPostcodeQuery("");
    setAddressPostcodeOptions([]);
  };


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
    acceptingNewClients: false,
    gender: "",
    isVerified: false,
    bio: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch outcodes for service areas
  useEffect(() => {
    if (!postcodeQuery.trim()) {
      setPostcodeOptions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await axios.get(
          `${apiUrl}/outcodes?q=${postcodeQuery}&limit=50`,
          { headers: { Authorization: `Bearer ${adminjwt}` } }
        );
        // API returns { result: [ { postcode: "SW1A" }, ... ] }
        setPostcodeOptions(res.data?.result || []);
      } catch (err) {
        console.error("Error fetching outcodes:", err);
        setPostcodeOptions([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [postcodeQuery]);

  const handlePostcodeSelect = (postcode) => {
    if (!form.servicesInPostalCodes.includes(postcode)) {
      setForm((prev) => ({
        ...prev,
        servicesInPostalCodes: [...prev.servicesInPostalCodes, postcode],
      }));
    }
    setPostcodeQuery(""); // clear input after select
    setPostcodeOptions([]);
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${apiUrl}/services/list`, {
          headers: {
            Authorization: `Bearer ${adminjwt}`
          }
        });
        console.log("These are the services: ", res.data);
        setServicesList(res.data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    };
    fetchServices();
  }, []);

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

    if (!form.firstName.trim()) return toast.error("First Name is required");
    if (!form.username.trim()) return toast.error("Username is required");
    if (!form.phone.trim()) return toast.error("Phone number is required");
    if (!form.email.trim()) return toast.error("Email is required");
    if (!form.password.trim()) return toast.error("Password is required");
    if (!form.experience) return toast.error("Experience is required");
    if (form.services.length === 0) return toast.error("Select at least one service");
    if (form.languages.length === 0) return toast.error("Add at least one language");
    if (!form.gender) return toast.error("Gender is required");
    if (!form.address.PostalCode) return toast.error("Address PostalCode is required");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("username", form.username);
      formData.append(
        "experience",
        form.experience ? Number(form.experience) : 0
      );
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("bio", form.bio);

      Object.entries(form.address).forEach(([key, value]) => {
        formData.append(`address[${key}]`, value);
      });

      form.services.forEach((s) => formData.append("services[]", s));
      form.languages.forEach((l) => formData.append("languages[]", l));
      form.servicesInPostalCodes.forEach((pc) =>
        formData.append("servicesInPostalCodes[]", pc)
      );

      formData.append("active", form.acceptingNewClients);
      formData.append("gender", form.gender);
      formData.append("isVerified", form.isVerified);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const res = await axios.post(`${apiUrl}/admin/createtherapist`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${adminjwt}`,
        },
      });

      console.log("Therapist saved:", res.data);
      toast.success("Therapist added successfully!");

      resetForm();
    } catch (err) {
      console.error("Error saving therapist:", err);
      toast.error("Failed to add therapist.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
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
      acceptingNewClients: false,
      gender: "",
      isVerified: false,
      bio: "",
    });
    setProfileImage(null);
    setPreviewUrl("");
  };

  return (
    <div className="bg-black text-white min-h-screen p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Add New Therapist</h2>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm"
        >
          {/* <Eye size={18} /> Preview Profile */}
        </button>
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
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
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
            <label className="block text-sm text-gray-400 mb-1">First Name *</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary focus:ring-1 focus:ring-primary hover:ring-1 hover:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Last Name (Optional)</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary focus:ring-1 focus:ring-primary hover:ring-1 hover:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Username / Display Name *
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary focus:ring-1 focus:ring-primary hover:ring-1 hover:ring-primary"
              required
            />
          </div>
        </div>

        {/* Phone + Email + Password */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone Number *</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary focus:ring-1 focus:ring-primary hover:ring-1 hover:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary focus:ring-1 focus:ring-primary hover:ring-1 hover:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password *</label>
            <input
              type="text"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary focus:ring-1 focus:ring-primary hover:ring-1 hover:ring-primary"
              required
            />
          </div>
        </div>

        {/* Experience */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Experience *</label>
          <input
            type="number"
            value={form.experience}
            onChange={(e) => handleChange("experience", e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg p-2 text-white 
      focus:border-primary focus:ring-1 focus:ring-primary hover:ring-1 hover:ring-primary"
            placeholder="Years of experience"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Address</label>
          <div className="grid grid-cols-2 gap-2">
            {["Building_No", "Street", "Locality", "PostTown"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field}
                value={form.address[field]}
                onChange={(e) => handleChange(field, e.target.value, true)}
                className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary focus:ring-1 focus:ring-primary hover:ring-1 hover:ring-primary"
              />
            ))}

            {/* 🔍 PostalCode with search */}
            <div className="relative">
              <input
                type="text"
                placeholder="PostalCode"
                value={form.address.PostalCode || addressPostcodeQuery}
                onChange={(e) => {
                  setAddressPostcodeQuery(e.target.value);
                  handleChange("PostalCode", e.target.value, true);
                }}
                className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary focus:ring-1 focus:ring-primary hover:ring-1 hover:ring-primary"
              />

              {addressPostcodeOptions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-black border border-white/10 rounded-lg shadow-lg">
                  {addressPostcodeOptions.map((item) => (
                    <button
                      key={item.postcode}
                      type="button"
                      onClick={() => handleAddressPostcodeSelect(item.postcode)}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors
                ${form.address.PostalCode === item.postcode
                          ? "text-gray-500 cursor-not-allowed"
                          : "text-white hover:bg-gray-800 hover:text-primary"
                        }`}
                    >
                      {item.postcode}{" "}
                      <span className="text-xs text-gray-500">({item.region})</span>
                    </button>
                  ))}
                </div>
              )}

              {isAddressSearching && (
                <div className="absolute top-full mt-1 text-sm text-gray-400">
                  Searching...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Services Offered */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Services Offered *</label>
          <div className="grid grid-cols-2 gap-2">
            {servicesList.map((service) => {
              const serviceId = service._id;
              const isChecked = form.services.includes(serviceId);
              return (
                <label
                  key={serviceId}
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
                          ? form.services.filter((s) => s !== serviceId)
                          : [...form.services, serviceId]
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm">{service.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Services Available in London Areas */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">
            Services Available in Postcodes *
          </label>

          {/* Search Input */}
          <div className="relative mb-3">
            <input
              type="text"
              value={postcodeQuery}
              onChange={(e) => setPostcodeQuery(e.target.value)}
              placeholder="Search postcode (e.g., SW1A)"
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
            />

            {/* Dropdown */}
            {postcodeOptions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-black border border-white/10 rounded-lg shadow-lg">
                {postcodeOptions.map((item) => (
                  <button
                    key={item.postcode}
                    type="button"
                    onClick={() => handlePostcodeSelect(item.postcode)}
                    disabled={form.servicesInPostalCodes.includes(item.postcode)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors
          ${form.servicesInPostalCodes.includes(item.postcode)
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-white hover:bg-gray-800 hover:text-primary"
                      }`}
                  >
                    {item.postcode}
                  </button>
                ))}
              </div>
            )}

            {/* Loading */}
            {isSearching && (
              <div className="absolute top-full mt-1 text-sm text-gray-400">
                Searching...
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
                  onClick={() => removeArea(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Accepting New Clients + Gender */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Accepting New Clients Toggle */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Accepting New Clients
            </label>
            <div className="flex gap-2">
              {["Yes", "No"].map((option) => {
                const isActive =
                  (option === "Yes" && form.acceptingNewClients) ||
                  (option === "No" && !form.acceptingNewClients);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      handleChange("acceptingNewClients", option === "Yes")
                    }
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
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Verified Therapist Toggle */}
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
          <label className="block text-sm text-gray-400 mb-2">Languages *</label>
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
            className="w-full hover:border-primary bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1">
            Short Bio / Description
          </label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:border-primary focus:ring-1 focus:ring-primary hover:ring-1 hover:ring-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg font-semibold transition-opacity duration-200
      ${loading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-primary text-black hover:opacity-90'}
    `}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Therapist'}
          </button>
        </div>
      </form>
    </div>
  );
}
