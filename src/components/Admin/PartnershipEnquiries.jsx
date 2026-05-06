import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2, Mail, Eye, X, Download } from "lucide-react";
import { exportToCsv } from "../../utils/exportToCsv";

const STATUS_OPTIONS = ["new", "contacted", "closed"];

const statusBadge = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  closed: "bg-gray-500/20 text-gray-400 border-gray-500/40",
};

export default function PartnershipEnquiries() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const adminjwt = localStorage.getItem("adminjwt");
  const headers = { Authorization: `Bearer ${adminjwt}` };

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [active, setActive] = useState(null);

  const fetchEnquiries = async (status = "") => {
    setLoading(true);
    try {
      const url = status
        ? `${apiUrl}/admin/partnerships?status=${status}`
        : `${apiUrl}/admin/partnerships`;
      const res = await axios.get(url, { headers });
      setEnquiries(res.data.enquiries || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load partnership enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries(statusFilter);
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${apiUrl}/admin/partnerships/${id}`,
        { status },
        { headers }
      );
      toast.success(`Marked as ${status}`);
      setEnquiries((list) =>
        list.map((e) => (e._id === id ? { ...e, status } : e))
      );
      if (active?._id === id) setActive({ ...active, status });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm("Delete this enquiry permanently?")) return;
    try {
      await axios.delete(`${apiUrl}/admin/partnerships/${id}`, { headers });
      toast.success("Enquiry deleted");
      setEnquiries((list) => list.filter((e) => e._id !== id));
      if (active?._id === id) setActive(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6 text-white min-h-screen bg-[#0d0d0d]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Partnership Enquiries</h1>
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() =>
              exportToCsv(
                `partnership-enquiries-${new Date().toISOString().slice(0, 10)}`,
                [
                  { label: "Name", value: "name" },
                  { label: "Email", value: "email" },
                  { label: "Partnership Type", value: "type" },
                  { label: "Business", value: "business" },
                  { label: "Instagram", value: "instagram" },
                  { label: "TikTok", value: "tiktok" },
                  { label: "Message", value: "message" },
                  { label: "Status", value: "status" },
                  {
                    label: "Received",
                    value: (r) => new Date(r.createdAt).toLocaleString(),
                  },
                ],
                enquiries
              )
            }
            disabled={!enquiries.length}
            className="inline-flex items-center gap-2 bg-primary text-black font-medium rounded px-3 py-2 text-sm hover:bg-[#b8924f] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            Export to Excel
          </button>
          <label className="text-sm text-gray-400">Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111] border border-gray-700 rounded px-3 py-2 text-sm"
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : enquiries.length === 0 ? (
        <div className="text-gray-400 bg-[#111] rounded-xl p-8 text-center border border-gray-800">
          No enquiries yet.
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#111] rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-[#1a1a1a] text-gray-300">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Business</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Received</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr
                  key={e._id}
                  className="border-t border-gray-800 hover:bg-[#161616]"
                >
                  <td className="px-4 py-3">{e.name}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${e.email}`}
                      className="text-primary hover:underline"
                    >
                      {e.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">{e.type}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {e.business || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs border ${
                        statusBadge[e.status] || ""
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(e.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => setActive(e)}
                        className="p-2 text-gray-400 hover:text-white"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <a
                        href={`mailto:${e.email}`}
                        className="p-2 text-gray-400 hover:text-white"
                        title="Email"
                      >
                        <Mail size={16} />
                      </a>
                      <button
                        onClick={() => deleteEnquiry(e._id)}
                        className="p-2 text-red-500 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="bg-[#111] border border-gray-800 rounded-2xl p-6 w-full max-w-2xl text-white"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{active.name}</h2>
              <button
                onClick={() => setActive(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-400">Email</dt>
                <dd>
                  <a
                    href={`mailto:${active.email}`}
                    className="text-primary hover:underline"
                  >
                    {active.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-gray-400">Partnership type</dt>
                <dd>{active.type}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Business name</dt>
                <dd>{active.business || "—"}</dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-gray-400">Instagram</dt>
                  <dd>{active.instagram || "—"}</dd>
                </div>
                <div>
                  <dt className="text-gray-400">TikTok</dt>
                  <dd>{active.tiktok || "—"}</dd>
                </div>
              </div>
              <div>
                <dt className="text-gray-400">Message</dt>
                <dd className="whitespace-pre-wrap bg-[#0d0d0d] border border-gray-800 rounded p-3 mt-1">
                  {active.message || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400">Received</dt>
                <dd>{new Date(active.createdAt).toLocaleString()}</dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(active._id, s)}
                  className={`px-3 py-1.5 rounded text-xs border ${
                    active.status === s
                      ? "bg-primary text-black border-primary"
                      : "border-gray-700 text-gray-300 hover:border-primary hover:text-primary"
                  }`}
                >
                  Mark as {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
