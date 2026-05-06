
import React, { useState, useEffect } from "react";
import { ArrowLeft, Eye, Upload, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import FancyDropdown from "../browseTherapist/FancyDropdown";

export default function EditService() {
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [tier, setTier] = useState("Normal");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminjwt = localStorage.getItem("adminjwt");

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { id } = useParams(); // expect route like /admin/editservice/:id

  /* ----------- Fetch Service Data ----------- */
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`${apiUrl}/admin/services/${id}`, {
          headers: {
            Authorization: `Bearer ${adminjwt}`,
          },
        });
        const data = res.data;

        setServiceName(data.name || "");
        setDescription(data.description || "");
        setTier(data.tier || "Normal");
        setOptions(
          data.options?.map((opt) => ({
            durationMinutes: opt.durationMinutes,
            price: { amount: opt.price.amount },
            label: opt.label || "",
          })) || []
        );
        setImagePreview(data.image_url || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load service data");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [apiUrl, id]);

  /* ----------- Duration & Price Handling ----------- */
  const addOption = () => {
    setOptions([
      ...options,
      { durationMinutes: 60, price: { amount: 0 }, label: "" },
    ]);
  };

  const updateOption = (index, field, value) => {
    const updated = [...options];
    if (field === "durationMinutes") {
      updated[index].durationMinutes = parseInt(value, 10);
    } else if (field === "amount") {
      updated[index].price.amount = parseFloat(value);
    } else if (field === "label") {
      updated[index].label = value;
    }
    setOptions(updated);
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  /* ----------- Submit Form ----------- */
  /* ----------- Submit Form ----------- */
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", serviceName);
      formData.append("tier", tier);
      formData.append("description", description);
      formData.append("options", JSON.stringify(options));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axios.put(
        `${apiUrl}/admin/editservices/${id}`, // ✅ updated endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${adminjwt}`
          },
        }
      );

      if (res.status === 200) {
        toast.success(res.data?.message || "Service updated successfully");
        navigate(-1); // go back to previous page
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update service");
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading service...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-[#111] rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-primary" />
              </button>
              <div>
                <h1 className="text-xl font-semibold">Edit Service</h1>
                <p className="text-sm text-white/60 mt-1">
                  Update this massage service
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-primary text-black rounded-lg hover:opacity-90 font-medium"
              >
                ✓ Save Changes
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-[#111] rounded-lg p-6 mb-6 border border-white/10">
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-black text-sm font-bold">
                1
              </span>
              Basic Information
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Service Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Detailed Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-[#0d0d0d] border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FancyDropdown
                  label="Tier"
                  options={["Normal", "Premium"]}
                  value={tier}
                  onChange={setTier}
                />
              </div>
            </div>
          </div>

          {/* Media & Visuals */}
          <div className="bg-[#111] rounded-lg p-6 mb-6 border border-white/10">
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-black text-sm font-bold">
                2
              </span>
              Media & Visuals
            </h2>

            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-primary transition">
              {imagePreview && !imageFile && (
                <img
                  src={imagePreview}
                  alt="Service"
                  className="w-full h-40 object-cover mb-4 rounded-lg"
                />
              )}
              <Upload size={32} className="mx-auto mb-4 text-white/40" />
              <p className="text-sm text-white/70 mb-2">
                Drag & drop or click to browse
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-[#0d0d0d] text-white rounded-lg hover:bg-[#111] transition cursor-pointer"
              >
                Choose File
              </label>
            </div>
          </div>

          {/* Duration & Pricing */}
          <div className="bg-[#111] rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-black text-sm font-bold">
                  £
                </span>
                Duration & Pricing
              </h2>
              <button
                onClick={addOption}
                className="text-primary text-sm font-medium hover:opacity-80"
              >
                + Add Option
              </button>
            </div>

            {options.map((opt, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={opt.durationMinutes}
                    onChange={(e) =>
                      updateOption(index, "durationMinutes", e.target.value)
                    }
                    className="w-full bg-[#0d0d0d] border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price (£)
                  </label>
                  <input
                    type="number"
                    value={opt.price.amount}
                    onChange={(e) => updateOption(index, "amount", e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={opt.label}
                    onChange={(e) => updateOption(index, "label", e.target.value)}
                    placeholder="e.g., Standard session"
                    className="w-full bg-[#0d0d0d] border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="col-span-3 flex justify-end">
                  <button
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div className="w-96 bg-[#0d0d0d] p-6 border-l border-white/10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Eye size={16} className="text-primary" />
            Live Preview
          </h2>
          <div className="bg-[#111] rounded-lg overflow-hidden border border-white/10">
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="w-full h-40 object-cover"
              />
            ) : imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-[#222] text-white/40">
                No Image Selected
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">
                  {serviceName || "Service Name"}
                </h3>
              </div>
              <p className="text-sm text-white/60 mb-3">
                {description || "Service short description here..."}
              </p>
              <ul className="space-y-1 text-sm mb-4">
                {options.map((opt, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b border-white/10 pb-1"
                  >
                    <span>{opt.durationMinutes} min</span>
                    <span>£{opt.price.amount}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-2 bg-primary text-black rounded-lg font-semibold hover:opacity-90 transition">
                Book Now
              </button>
            </div>
          </div>
          <p className="text-xs text-white/50 mt-4">
            Preview Updates: Changes will reflect here as you fill out the form.
          </p>
        </div>
      </div>
    </div>
  );
}
