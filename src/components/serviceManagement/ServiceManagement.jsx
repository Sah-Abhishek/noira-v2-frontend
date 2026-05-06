import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Search, Trash2, Edit, Eye } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Make sure you have react-toastify
import ConfirmDeleteModal from "./ConfirmDeleteServiceModal";

export default function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const adminjwt = localStorage.getItem('adminjwt');

  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;

  // 🔹 Handle delete request
  const handleDelete = async (serviceId) => {
    try {
      const res = await axios.delete(`${apiUrl}/admin/deleteservices/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${adminjwt}`,
        },

      });
      if (res.status === 200) {
        toast.success(res.data.message || "Service deleted successfully");
        // remove service from state
        setServices((prev) => prev.filter((s) => s._id !== serviceId));
        setFilteredServices((prev) => prev.filter((s) => s._id !== serviceId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete service");
      console.error("Error deleting service:", error);
    } finally {
      setIsConfirmDeleteModalOpen(false);
      setServiceToDelete(null);
    }
  };

  // 🔹 Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${apiUrl}/services/list`, {
          headers: {
            Authorization: `Bearer ${adminjwt}`,

          }
        });
        setServices(res.data);
        setFilteredServices(res.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // 🔹 Search filter
  useEffect(() => {
    if (!searchTerm) {
      setFilteredServices(services);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = services.filter(
      (service) =>
        service.name.toLowerCase().includes(term) ||
        service.features.some((feat) => feat.toLowerCase().includes(term))
    );
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex items-center justify-center">
        <p className="text-primary">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Service Management</h1>
          <p className="text-white/60 text-sm">
            Manage your massage services and pricing
          </p>
        </div>
        <button
          onClick={() =>
            navigate("/admin/createnewservice", { state: { from: location } })
          }
          className="flex items-center gap-2 bg-primary text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <Plus size={18} />
          Add New Service
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center bg-[#0d0d0d] px-4 py-2 rounded-lg border border-white/10 flex-1 mb-8">
        <Search size={18} className="text-white/40" />
        <input
          type="text"
          placeholder="Search services or features..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none px-2 flex-1 text-sm text-white"
        />
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <p className="text-white/50">No services match your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service._id}
              className="bg-[#0d0d0d] rounded-xl overflow-hidden border border-white/10 shadow-md hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="w-full h-40 object-cover"
                />
                <span
                  className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full ${service.tier === "premium"
                    ? "bg-primary text-black"
                    : "bg-gray-500 text-white"
                    }`}
                >
                  {service.tier}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold mb-1">{service.name}</h3>
                <p className="text-sm text-white/60 mb-3 line-clamp-3">
                  {service.description}
                </p>

                {/* Features */}
                {service.features?.length > 0 && (
                  <ul className="mb-4 space-y-1">
                    {service.features.map((feat, i) => (
                      <li
                        key={i}
                        className="text-xs text-primary bg-[#111] px-2 py-1 rounded-md inline-block mr-1 mb-1"
                      >
                        {feat}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Options */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.options.map((opt) => (
                    <span
                      key={opt._id}
                      className="px-3 py-1 text-xs rounded-md bg-[#111] border border-primary/20 text-primary"
                    >
                      {opt.durationMinutes} min – £{opt.price.amount}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/admin/editservice/${service._id}`)} className="flex items-center gap-1 bg-primary text-black text-sm font-medium px-3 py-1 rounded-md hover:opacity-90 transition">
                      <Edit size={14} /> Edit
                    </button>
                    {/* <button className="flex items-center gap-1 bg-[#222] text-white text-sm font-medium px-3 py-1 rounded-md hover:bg-[#333] transition"> */}
                    {/*   <Eye size={14} /> Preview */}
                    {/* </button> */}
                  </div>
                  <button
                    onClick={() => {
                      setServiceToDelete(service._id);
                      setIsConfirmDeleteModalOpen(true);
                    }}
                    className="p-2 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onConfirm={() => handleDelete(serviceToDelete)}
        onClose={() => {
          setIsConfirmDeleteModalOpen(false);
          setServiceToDelete(null);
        }}
      />
    </div>
  );
}
