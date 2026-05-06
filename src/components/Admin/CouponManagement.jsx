import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  X,
  Ticket,
  Copy,
  Check,
  BarChart3,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const emptyForm = {
  code: "",
  type: "percentage",
  value: "",
  maxUses: "",
  expiryDate: "",
  minOrderAmount: "",
  description: "",
  isActive: true,
};

export default function CouponManagement() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  // Copy feedback
  const [copiedId, setCopiedId] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const adminjwt = localStorage.getItem("adminjwt");

  const headers = { Authorization: `Bearer ${adminjwt}` };

  // Fetch coupons
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admin/coupons`, { headers });
      setCoupons(res.data.coupons);
      setFilteredCoupons(res.data.coupons);
    } catch (error) {
      toast.error("Failed to load coupons");
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search filter
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCoupons(coupons);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = coupons.filter(
      (c) =>
        c.code.toLowerCase().includes(term) ||
        c.type.toLowerCase().includes(term) ||
        (c.description && c.description.toLowerCase().includes(term))
    );
    setFilteredCoupons(filtered);
  }, [searchTerm, coupons]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setEditId(null);
    setShowModal(true);
  };

  const openEditModal = (coupon) => {
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value || "",
      maxUses: coupon.maxUses || "",
      expiryDate: coupon.expiryDate
        ? new Date(coupon.expiryDate).toISOString().split("T")[0]
        : "",
      minOrderAmount: coupon.minOrderAmount || "",
      description: coupon.description || "",
      isActive: coupon.isActive,
    });
    setIsEditing(true);
    setEditId(coupon._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.type) {
      toast.error("Code and type are required");
      return;
    }

    if (form.type === "percentage" && (Number(form.value) <= 0 || Number(form.value) > 100)) {
      toast.error("Percentage must be between 1 and 100");
      return;
    }

    if (form.type === "fixed" && Number(form.value) <= 0) {
      toast.error("Fixed discount must be greater than 0");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        code: form.code,
        type: form.type,
        value: form.type === "free" ? 0 : Number(form.value),
        maxUses: form.maxUses ? Number(form.maxUses) : 0,
        expiryDate: form.expiryDate || null,
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
        description: form.description,
        isActive: form.isActive,
      };

      if (isEditing) {
        const res = await axios.put(
          `${apiUrl}/admin/coupons/${editId}`,
          payload,
          { headers }
        );
        toast.success(res.data.message || "Coupon updated");
      } else {
        const res = await axios.post(`${apiUrl}/admin/coupons`, payload, {
          headers,
        });
        toast.success(res.data.message || "Coupon created");
      }

      setShowModal(false);
      setForm(emptyForm);
      fetchCoupons();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save coupon"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!couponToDelete) return;
    try {
      const res = await axios.delete(
        `${apiUrl}/admin/coupons/${couponToDelete}`,
        { headers }
      );
      toast.success(res.data.message || "Coupon deleted");
      setCoupons((prev) => prev.filter((c) => c._id !== couponToDelete));
      setFilteredCoupons((prev) =>
        prev.filter((c) => c._id !== couponToDelete)
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete coupon");
    } finally {
      setShowDeleteModal(false);
      setCouponToDelete(null);
    }
  };

  // Toggle active status
  const toggleActive = async (coupon) => {
    try {
      await axios.put(
        `${apiUrl}/admin/coupons/${coupon._id}`,
        { isActive: !coupon.isActive },
        { headers }
      );
      setCoupons((prev) =>
        prev.map((c) =>
          c._id === coupon._id ? { ...c, isActive: !c.isActive } : c
        )
      );
      toast.success(
        `Coupon ${!coupon.isActive ? "activated" : "deactivated"}`
      );
    } catch (error) {
      toast.error("Failed to update coupon status");
    }
  };

  // Copy code
  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Format helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return "No expiry";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTypeLabel = (type, value) => {
    if (type === "percentage") return `${value}% off`;
    if (type === "fixed") return `£${value} off`;
    return "Free";
  };

  const getTypeBadgeClass = (type) => {
    if (type === "percentage") return "bg-blue-500/20 text-blue-400";
    if (type === "fixed") return "bg-purple-500/20 text-purple-400";
    return "bg-green-500/20 text-green-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex items-center justify-center">
        <p className="text-primary">Loading coupons...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Coupon Management</h1>
          <p className="text-white/60 text-sm">
            Create and manage discount coupon codes
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/couponanalytics")}
            className="flex items-center gap-2 border border-primary/40 text-primary font-semibold px-4 py-2 rounded-lg hover:bg-primary/10 transition"
          >
            <BarChart3 size={18} />
            Analytics
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-primary text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            <Plus size={18} />
            Create Coupon
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-[#0d0d0d] px-4 py-2 rounded-lg border border-white/10 flex-1 mb-8">
        <Search size={18} className="text-white/40" />
        <input
          type="text"
          placeholder="Search by code, type, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none px-2 flex-1 text-sm text-white"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-xs mb-1">Total Coupons</p>
          <p className="text-2xl font-bold">{coupons.length}</p>
        </div>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-xs mb-1">Active</p>
          <p className="text-2xl font-bold text-green-400">
            {coupons.filter((c) => c.isActive).length}
          </p>
        </div>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-xs mb-1">Inactive</p>
          <p className="text-2xl font-bold text-red-400">
            {coupons.filter((c) => !c.isActive).length}
          </p>
        </div>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-xs mb-1">Total Redemptions</p>
          <p className="text-2xl font-bold text-primary">
            {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
          </p>
        </div>
      </div>

      {/* Coupons Table */}
      {filteredCoupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-white/40">
          <Ticket size={48} className="mb-4" />
          <p>No coupons found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-left">
                <th className="pb-3 pr-4">Code</th>
                <th className="pb-3 pr-4">Discount</th>
                <th className="pb-3 pr-4 hidden md:table-cell">Min Order</th>
                <th className="pb-3 pr-4 hidden md:table-cell">Usage</th>
                <th className="pb-3 pr-4 hidden lg:table-cell">Expiry</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  {/* Code */}
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white tracking-wider">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => copyCode(coupon.code, coupon._id)}
                        className="text-white/30 hover:text-white transition"
                        title="Copy code"
                      >
                        {copiedId === coupon._id ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                    {coupon.description && (
                      <p className="text-white/40 text-xs mt-1 max-w-[200px] truncate">
                        {coupon.description}
                      </p>
                    )}
                  </td>

                  {/* Discount */}
                  <td className="py-4 pr-4">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${getTypeBadgeClass(
                        coupon.type
                      )}`}
                    >
                      {getTypeLabel(coupon.type, coupon.value)}
                    </span>
                  </td>

                  {/* Min Order */}
                  <td className="py-4 pr-4 hidden md:table-cell text-white/60">
                    {coupon.minOrderAmount > 0
                      ? `£${coupon.minOrderAmount}`
                      : "None"}
                  </td>

                  {/* Usage */}
                  <td className="py-4 pr-4 hidden md:table-cell text-white/60">
                    {coupon.usedCount}
                    {coupon.maxUses > 0 ? ` / ${coupon.maxUses}` : " / ∞"}
                  </td>

                  {/* Expiry */}
                  <td className="py-4 pr-4 hidden lg:table-cell">
                    <span
                      className={`text-xs ${
                        coupon.expiryDate &&
                        new Date(coupon.expiryDate) < new Date()
                          ? "text-red-400"
                          : "text-white/60"
                      }`}
                    >
                      {formatDate(coupon.expiryDate)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 pr-4">
                    <button
                      onClick={() => toggleActive(coupon)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        coupon.isActive ? "bg-green-500" : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                          coupon.isActive
                            ? "translate-x-4.5"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="p-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setCouponToDelete(coupon._id);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20 transition"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold">
                {isEditing ? "Edit Coupon" : "Create New Coupon"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/40 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Code */}
              <div>
                <label className="text-sm text-white/60 mb-1 block">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="e.g. SUMMER25"
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary uppercase"
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-sm text-white/60 mb-1 block">
                  Discount Type *
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (£)</option>
                  <option value="free">Free (100% off)</option>
                </select>
              </div>

              {/* Value - hidden for "free" type */}
              {form.type !== "free" && (
                <div>
                  <label className="text-sm text-white/60 mb-1 block">
                    {form.type === "percentage"
                      ? "Discount Percentage (1-100)"
                      : "Discount Amount (£)"}
                  </label>
                  <input
                    type="number"
                    name="value"
                    value={form.value}
                    onChange={handleChange}
                    min="1"
                    max={form.type === "percentage" ? "100" : undefined}
                    placeholder={
                      form.type === "percentage" ? "e.g. 25" : "e.g. 10"
                    }
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              )}

              {/* Max Uses & Min Order - side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">
                    Max Uses
                  </label>
                  <input
                    type="number"
                    name="maxUses"
                    value={form.maxUses}
                    onChange={handleChange}
                    min="0"
                    placeholder="0 = unlimited"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">
                    Min Order (£)
                  </label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={form.minOrderAmount}
                    onChange={handleChange}
                    min="0"
                    placeholder="0 = no minimum"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="text-sm text-white/60 mb-1 block">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
                <p className="text-white/30 text-xs mt-1">
                  Leave empty for no expiry
                </p>
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
                  placeholder="Internal note about this coupon..."
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Active Toggle */}
              {isEditing && (
                <div className="flex items-center justify-between">
                  <label className="text-sm text-white/60">Active</label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
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
                    ? "Saving..."
                    : isEditing
                    ? "Update Coupon"
                    : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-2">Delete Coupon</h3>
            <p className="text-white/60 text-sm mb-6">
              Are you sure you want to delete this coupon? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCouponToDelete(null);
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
