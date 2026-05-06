// TherapistManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import TherapistTable from "./TherapistTable";
import { useNavigate } from "react-router-dom";
import { Check, Trash } from "lucide-react";
import BulkActionConfirmModal from "./BulkActionConfirmationModal";
import TherapistScheduleModalAdmin from "./TherapistScheduleModalAdmin";

export default function TherapistManagement() {
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapists, setSelectedTherapists] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const limit = 6;
  const adminjwt = localStorage.getItem("adminjwt");

  const api = `${apiUrl}/admin/therapist/list`;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const getTherapistId = (t) => t?.profile?._id || t?._id || null;

  // Fetch therapists
  const fetchTherapists = async (pageNum = 1) => {
    try {
      setLoading(true);

      let statusParam;
      if (statusFilter === "true") statusParam = true;
      else if (statusFilter === "false") statusParam = false;

      const res = await axios.get(api, {
        params: {
          page: pageNum,
          limit,
          search: debouncedSearch,
          ...(statusParam !== undefined && { status: statusParam }),
        },
        headers: {
          Authorization: `Bearer ${adminjwt}`,
        },
      });

      const { therapists: list, totalPages, total } = res?.data || {};
      setTherapists(Array.isArray(list) ? list : []);
      setTotalPages(totalPages || 1);
      setTotalCount(total || 0);
    } catch (err) {
      console.error("Error fetching therapists:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapists(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, statusFilter]);

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalCount);

  // Bulk action handler
  const handleBulkAction = async (action) => {
    try {
      const therapistIds = selectedTherapists
        .map((t) => getTherapistId(t))
        .filter(Boolean);

      if (therapistIds.length === 0) return;

      await axios.post(`${apiUrl}/admin/therapist/bulkaction`, {
        therapistIds,
        action,
      }, {
        headers: {
          Authorization: `Bearer ${adminjwt}`
        }
      });

      setSelectedTherapists([]);
      fetchTherapists(page);
    } catch (err) {
      console.error("Error performing bulk action:", err);
    }
  };

  const handleOpenModal = (action) => {
    setPendingAction(action);
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    await handleBulkAction(pendingAction);
    setShowModal(false);
    setPendingAction(null);
  };

  return (
    <div className="bg-black p-6 min-h-screen rounded-lg shadow-lg text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl text-primary font-bold">Therapist Management</h2>
        <button
          onClick={() => navigate("/admin/addnewtherapist")}
          className="bg-primary hover:bg-primary text-black font-semibold px-4 py-2 rounded"
        >
          + Add New Therapist
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="all">All</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedTherapists.length > 0 && (
        <div className="mb-4 p-3 bg-gray-800 border border-gray-700 rounded-lg flex justify-between items-center">
          <p className="text-sm text-gray-300">
            {selectedTherapists.length} selected
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleOpenModal("delete")}
              className="bg-red-500 inline-flex items-center justify-center gap-x-1 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
            >
              <Trash size={15} /> Delete
            </button>
            <button
              onClick={() => handleOpenModal("active")}
              className="bg-green-500 inline-flex items-center justify-center gap-x-1 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
            >
              <Check size={15} /> Set Active
            </button>
            <button
              onClick={() => handleOpenModal("inactive")}
              className="bg-yellow-500 hover:bg-yellow-600 text-black text-sm px-3 py-1 rounded"
            >
              Set Inactive
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="mt-4">
        <TherapistTable
          loading={loading}
          therapists={therapists}
          selectedTherapists={selectedTherapists}
          setSelectedTherapists={setSelectedTherapists}
        />
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        {!loading && totalCount > 0 && (
          <p className="text-white text-sm">
            Showing <span className="text-primary font-bold">{startIndex}</span>–
            <span className="text-primary font-bold">{endIndex}</span> of{" "}
            <span className="text-primary font-bold">{totalCount}</span> therapists
          </p>
        )}
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${page === i + 1
                ? "bg-primary text-black font-semibold"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <BulkActionConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        action={pendingAction}
        therapists={selectedTherapists} // full objects for the modal
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
