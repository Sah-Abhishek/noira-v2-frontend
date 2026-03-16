import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  X,
  Image,
  Upload,
  ExternalLink,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-hot-toast";

const PAGE_OPTIONS = [
  { value: "home", label: "Home Page" },
  { value: "services", label: "Services Page" },
  { value: "all-services", label: "All Services" },
  { value: "about", label: "About Page" },
  { value: "blog", label: "Blog Page" },
  { value: "booking", label: "Booking Flow" },
  { value: "careers", label: "Careers Page" },
  { value: "browse-therapists", label: "Browse Therapists" },
];

const POSITION_OPTIONS = [
  { value: "top", label: "Top of Page" },
  { value: "middle", label: "Middle of Page" },
  { value: "bottom", label: "Bottom of Page" },
];

const emptyForm = {
  title: "",
  description: "",
  linkUrl: "",
  pages: [],
  position: "top",
  startDate: "",
  endDate: "",
  priority: 0,
  isActive: true,
};

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterPage, setFilterPage] = useState("all");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const adminjwt = localStorage.getItem("adminjwt");
  const headers = { Authorization: `Bearer ${adminjwt}` };

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admin/banners`, { headers });
      setBanners(res.data.banners);
      setFilteredBanners(res.data.banners);
    } catch (error) {
      toast.error("Failed to load banners");
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter
  useEffect(() => {
    let result = banners;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(term) ||
          (b.description && b.description.toLowerCase().includes(term))
      );
    }

    if (filterPage !== "all") {
      result = result.filter((b) => b.pages.includes(filterPage));
    }

    setFilteredBanners(result);
  }, [searchTerm, filterPage, banners]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePage = (pageValue) => {
    setForm((prev) => ({
      ...prev,
      pages: prev.pages.includes(pageValue)
        ? prev.pages.filter((p) => p !== pageValue)
        : [...prev.pages, pageValue],
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
    setEditId(null);
    setShowModal(true);
  };

  const openEditModal = (banner) => {
    setForm({
      title: banner.title,
      description: banner.description || "",
      linkUrl: banner.linkUrl || "",
      pages: banner.pages || [],
      position: banner.position || "top",
      startDate: banner.startDate
        ? new Date(banner.startDate).toISOString().split("T")[0]
        : "",
      endDate: banner.endDate
        ? new Date(banner.endDate).toISOString().split("T")[0]
        : "",
      priority: banner.priority || 0,
      isActive: banner.isActive,
    });
    setImageFile(null);
    setImagePreview(banner.imageUrl);
    setIsEditing(true);
    setEditId(banner._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title) {
      toast.error("Title is required");
      return;
    }
    if (form.pages.length === 0) {
      toast.error("Select at least one page");
      return;
    }
    if (!isEditing && !imageFile) {
      toast.error("Banner image is required");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("linkUrl", form.linkUrl);
      formData.append("pages", JSON.stringify(form.pages));
      formData.append("position", form.position);
      formData.append("startDate", form.startDate || "");
      formData.append("endDate", form.endDate || "");
      formData.append("priority", form.priority);
      formData.append("isActive", form.isActive);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isEditing) {
        const res = await axios.put(
          `${apiUrl}/admin/banners/${editId}`,
          formData,
          { headers: { ...headers, "Content-Type": "multipart/form-data" } }
        );
        toast.success(res.data.message || "Banner updated");
      } else {
        const res = await axios.post(`${apiUrl}/admin/banners`, formData, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
        toast.success(res.data.message || "Banner created");
      }

      setShowModal(false);
      setForm(emptyForm);
      setImageFile(null);
      setImagePreview(null);
      fetchBanners();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save banner");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    try {
      const res = await axios.delete(
        `${apiUrl}/admin/banners/${bannerToDelete}`,
        { headers }
      );
      toast.success(res.data.message || "Banner deleted");
      setBanners((prev) => prev.filter((b) => b._id !== bannerToDelete));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete banner");
    } finally {
      setShowDeleteModal(false);
      setBannerToDelete(null);
    }
  };

  const toggleActive = async (banner) => {
    try {
      const formData = new FormData();
      formData.append("isActive", !banner.isActive);
      await axios.put(`${apiUrl}/admin/banners/${banner._id}`, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      setBanners((prev) =>
        prev.map((b) =>
          b._id === banner._id ? { ...b, isActive: !b.isActive } : b
        )
      );
      toast.success(`Banner ${!banner.isActive ? "activated" : "deactivated"}`);
    } catch (error) {
      toast.error("Failed to update banner status");
    }
  };

  const getBannerStatus = (banner) => {
    if (!banner.isActive) return { label: "Inactive", cls: "bg-gray-500/20 text-gray-400" };
    const now = new Date();
    if (banner.startDate && new Date(banner.startDate) > now)
      return { label: "Scheduled", cls: "bg-yellow-500/20 text-yellow-400" };
    if (banner.endDate && new Date(banner.endDate) < now)
      return { label: "Expired", cls: "bg-red-500/20 text-red-400" };
    return { label: "Live", cls: "bg-green-500/20 text-green-400" };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex items-center justify-center">
        <p className="text-primary">Loading banners...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Banner Management</h1>
          <p className="text-white/60 text-sm">
            Upload and manage event banners across pages
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primary text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <Plus size={18} />
          Add Banner
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex items-center bg-[#0d0d0d] px-4 py-2 rounded-lg border border-white/10 flex-1">
          <Search size={18} className="text-white/40" />
          <input
            type="text"
            placeholder="Search banners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none px-2 flex-1 text-sm text-white"
          />
        </div>
        <div className="relative">
          <select
            value={filterPage}
            onChange={(e) => setFilterPage(e.target.value)}
            className="appearance-none bg-[#0d0d0d] border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-primary"
          >
            <option value="all">All Pages</option>
            {PAGE_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-xs mb-1">Total Banners</p>
          <p className="text-2xl font-bold">{banners.length}</p>
        </div>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-xs mb-1">Live</p>
          <p className="text-2xl font-bold text-green-400">
            {banners.filter((b) => getBannerStatus(b).label === "Live").length}
          </p>
        </div>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-xs mb-1">Scheduled</p>
          <p className="text-2xl font-bold text-yellow-400">
            {banners.filter((b) => getBannerStatus(b).label === "Scheduled").length}
          </p>
        </div>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-xs mb-1">Expired</p>
          <p className="text-2xl font-bold text-red-400">
            {banners.filter((b) => getBannerStatus(b).label === "Expired").length}
          </p>
        </div>
      </div>

      {/* Banner Cards */}
      {filteredBanners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-white/40">
          <Image size={48} className="mb-4" />
          <p>No banners found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBanners.map((banner) => {
            const status = getBannerStatus(banner);
            return (
              <div
                key={banner._id}
                className="bg-[#0d0d0d] rounded-xl overflow-hidden border border-white/10 shadow-md hover:shadow-lg transition"
              >
                {/* Banner Image */}
                <div className="relative">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-48 object-cover"
                  />
                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full ${status.cls}`}
                  >
                    {status.label}
                  </span>
                  {/* Position Badge */}
                  <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full bg-black/60 text-white/80 capitalize">
                    {banner.position}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold truncate">{banner.title}</h3>
                      {banner.description && (
                        <p className="text-sm text-white/50 mt-1 line-clamp-2">
                          {banner.description}
                        </p>
                      )}
                    </div>
                    {/* Active Toggle */}
                    <button
                      onClick={() => toggleActive(banner)}
                      className={`ml-3 relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${
                        banner.isActive ? "bg-green-500" : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                          banner.isActive
                            ? "translate-x-4.5"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Pages Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {banner.pages.map((page) => {
                      const pageLabel =
                        PAGE_OPTIONS.find((p) => p.value === page)?.label ||
                        page;
                      return (
                        <span
                          key={page}
                          className="px-2 py-0.5 text-xs rounded-md bg-[#111] border border-primary/20 text-primary"
                        >
                          {pageLabel}
                        </span>
                      );
                    })}
                  </div>

                  {/* Date range & link */}
                  <div className="flex items-center gap-4 text-xs text-white/40 mb-4">
                    {(banner.startDate || banner.endDate) && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(banner.startDate)} - {formatDate(banner.endDate)}
                      </span>
                    )}
                    {banner.linkUrl && (
                      <a
                        href={banner.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary transition"
                      >
                        <ExternalLink size={12} />
                        Link
                      </a>
                    )}
                    <span>Priority: {banner.priority}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEditModal(banner)}
                      className="flex items-center gap-1 bg-primary text-black text-sm font-medium px-3 py-1 rounded-md hover:opacity-90 transition"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        setBannerToDelete(banner._id);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold">
                {isEditing ? "Edit Banner" : "Create New Banner"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/40 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Image Upload */}
              <div>
                <label className="text-sm text-white/60 mb-2 block">
                  Banner Image *
                </label>
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-white/10">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-3 right-3 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary/50 transition">
                      <Upload size={32} className="text-white/30 mb-2" />
                      <span className="text-sm text-white/40">
                        Click to upload banner image
                      </span>
                      <span className="text-xs text-white/25 mt-1">
                        Recommended: 1920 x 400px
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-sm text-white/60 mb-1 block">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Summer Sale - 20% Off"
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-white/60 mb-1 block">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Internal note about this banner..."
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Link URL */}
              <div>
                <label className="text-sm text-white/60 mb-1 block">
                  Link URL
                </label>
                <input
                  type="text"
                  name="linkUrl"
                  value={form.linkUrl}
                  onChange={handleChange}
                  placeholder="e.g. /allservicespage or https://..."
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
                <p className="text-white/30 text-xs mt-1">
                  Where users go when they click the banner (optional)
                </p>
              </div>

              {/* Pages Selection */}
              <div>
                <label className="text-sm text-white/60 mb-2 block">
                  Show on Pages *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PAGE_OPTIONS.map((page) => {
                    const selected = form.pages.includes(page.value);
                    return (
                      <button
                        key={page.value}
                        type="button"
                        onClick={() => togglePage(page.value)}
                        className={`px-3 py-2 rounded-lg text-sm text-left transition border ${
                          selected
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-black border-white/10 text-white/50 hover:border-white/30"
                        }`}
                      >
                        {page.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Position + Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">
                    Position
                  </label>
                  <select
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  >
                    {POSITION_OPTIONS.map((pos) => (
                      <option key={pos.value} value={pos.value}>
                        {pos.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">
                    Priority
                  </label>
                  <input
                    type="number"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    min="0"
                    placeholder="Higher = shown first"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <p className="text-white/30 text-xs -mt-3">
                Leave empty for always-on banners. Use dates for event/seasonal promotions.
              </p>

              {/* Active Toggle (edit only) */}
              {isEditing && (
                <div className="flex items-center justify-between">
                  <label className="text-sm text-white/60">Active</label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        isActive: !prev.isActive,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      form.isActive ? "bg-green-500" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                        form.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              )}

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-white/20 rounded-lg text-sm text-white/60 hover:text-white hover:border-white/40 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary text-black font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {submitting
                    ? "Uploading..."
                    : isEditing
                    ? "Update Banner"
                    : "Create Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-2">Delete Banner</h3>
            <p className="text-white/60 text-sm mb-6">
              Are you sure you want to delete this banner? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBannerToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 border border-white/20 rounded-lg text-sm text-white/60 hover:text-white hover:border-white/40 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
