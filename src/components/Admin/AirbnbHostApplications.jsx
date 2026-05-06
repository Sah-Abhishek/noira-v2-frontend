import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2, Mail, Eye, X, ExternalLink, Download } from "lucide-react";
import { exportToCsv } from "../../utils/exportToCsv";

const STATUS_OPTIONS = ["new", "contacted", "approved", "rejected", "closed"];

const statusBadge = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  approved: "bg-green-500/20 text-green-400 border-green-500/40",
  rejected: "bg-red-500/20 text-red-400 border-red-500/40",
  closed: "bg-gray-500/20 text-gray-400 border-gray-500/40",
};

export default function AirbnbHostApplications() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const adminjwt = localStorage.getItem("adminjwt");
  const headers = { Authorization: `Bearer ${adminjwt}` };

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [active, setActive] = useState(null);

  const fetchApplications = async (status = "") => {
    setLoading(true);
    try {
      const url = status
        ? `${apiUrl}/admin/airbnb-hosts?status=${status}`
        : `${apiUrl}/admin/airbnb-hosts`;
      const res = await axios.get(url, { headers });
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load Airbnb host applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(statusFilter);
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${apiUrl}/admin/airbnb-hosts/${id}`,
        { status },
        { headers }
      );
      toast.success(`Marked as ${status}`);
      setApplications((list) =>
        list.map((a) => (a._id === id ? { ...a, status } : a))
      );
      if (active?._id === id) setActive({ ...active, status });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm("Delete this application permanently?")) return;
    try {
      await axios.delete(`${apiUrl}/admin/airbnb-hosts/${id}`, { headers });
      toast.success("Application deleted");
      setApplications((list) => list.filter((a) => a._id !== id));
      if (active?._id === id) setActive(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6 text-white min-h-screen bg-[#0d0d0d]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Airbnb Host Applications</h1>
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() =>
              exportToCsv(
                `airbnb-host-applications-${new Date().toISOString().slice(0, 10)}`,
                [
                  { label: "First Name", value: "firstName" },
                  { label: "Last Name", value: "lastName" },
                  { label: "Email", value: "email" },
                  { label: "Phone", value: "phone" },
                  { label: "Property Name", value: "propertyName" },
                  { label: "Airbnb Listing URL", value: "airbnbListingUrl" },
                  { label: "Address", value: "propertyAddress" },
                  { label: "City", value: "city" },
                  { label: "Postcode", value: "postcode" },
                  { label: "Property Type", value: "propertyType" },
                  { label: "Bedrooms", value: "bedrooms" },
                  { label: "Access Instructions", value: "accessInstructions" },
                  {
                    label: "Estimated Monthly Bookings",
                    value: "estimatedMonthlyBookings",
                  },
                  {
                    label: "Massage Services Interested In",
                    value: (r) =>
                      (r.massageServicesInterested || []).join("; "),
                  },
                  {
                    label: "Adequate Space for Table",
                    value: "adequateSpaceForTable",
                  },
                  {
                    label: "Preferred Payment Arrangement",
                    value: "preferredPaymentArrangement",
                  },
                  { label: "Heard About Us", value: "heardAboutUs" },
                  { label: "Additional Notes", value: "additionalNotes" },
                  { label: "Status", value: "status" },
                  {
                    label: "Received",
                    value: (r) => new Date(r.createdAt).toLocaleString(),
                  },
                ],
                applications
              )
            }
            disabled={!applications.length}
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
      ) : applications.length === 0 ? (
        <div className="text-gray-400 bg-[#111] rounded-xl p-8 text-center border border-gray-800">
          No applications yet.
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#111] rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-[#1a1a1a] text-gray-300">
              <tr>
                <th className="text-left px-4 py-3">Host</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Property</th>
                <th className="text-left px-4 py-3">City</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Received</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr
                  key={a._id}
                  className="border-t border-gray-800 hover:bg-[#161616]"
                >
                  <td className="px-4 py-3">
                    {a.firstName} {a.lastName}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${a.email}`}
                      className="text-primary hover:underline"
                    >
                      {a.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">{a.propertyName}</td>
                  <td className="px-4 py-3 text-gray-400">{a.city}</td>
                  <td className="px-4 py-3 text-gray-400">{a.propertyType}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs border ${
                        statusBadge[a.status] || ""
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => setActive(a)}
                        className="p-2 text-gray-400 hover:text-white"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <a
                        href={`mailto:${a.email}`}
                        className="p-2 text-gray-400 hover:text-white"
                        title="Email"
                      >
                        <Mail size={16} />
                      </a>
                      <button
                        onClick={() => deleteApplication(a._id)}
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
            className="bg-[#111] border border-gray-800 rounded-2xl p-6 w-full max-w-2xl text-white max-h-[90vh] overflow-y-auto"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {active.firstName} {active.lastName}
              </h2>
              <button
                onClick={() => setActive(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 text-sm">
              <div>
                <h3 className="text-primary font-semibold mb-2 border-b border-gray-800 pb-1">
                  Host Information
                </h3>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-gray-400">Email</dt>
                    <dd>
                      <a
                        href={`mailto:${active.email}`}
                        className="text-primary hover:underline break-all"
                      >
                        {active.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-400">Phone</dt>
                    <dd>
                      <a
                        href={`tel:${active.phone}`}
                        className="text-primary hover:underline"
                      >
                        {active.phone}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-primary font-semibold mb-2 border-b border-gray-800 pb-1">
                  Property Details
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-gray-400">Property Name</dt>
                    <dd>{active.propertyName}</dd>
                  </div>
                  {active.airbnbListingUrl && (
                    <div>
                      <dt className="text-gray-400">Airbnb Listing</dt>
                      <dd>
                        <a
                          href={
                            active.airbnbListingUrl.startsWith("http")
                              ? active.airbnbListingUrl
                              : `https://${active.airbnbListingUrl}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1 break-all"
                        >
                          {active.airbnbListingUrl}
                          <ExternalLink size={12} />
                        </a>
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-gray-400">Address</dt>
                    <dd className="whitespace-pre-wrap">
                      {active.propertyAddress}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <dt className="text-gray-400">City</dt>
                      <dd>{active.city}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Postcode</dt>
                      <dd>{active.postcode}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Bedrooms</dt>
                      <dd>{active.bedrooms ?? "—"}</dd>
                    </div>
                  </div>
                  <div>
                    <dt className="text-gray-400">Property Type</dt>
                    <dd>{active.propertyType}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400">Access Instructions</dt>
                    <dd className="whitespace-pre-wrap bg-[#0d0d0d] border border-gray-800 rounded p-3 mt-1">
                      {active.accessInstructions}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-primary font-semibold mb-2 border-b border-gray-800 pb-1">
                  Service Requirements
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-gray-400">
                      Estimated Monthly Bookings
                    </dt>
                    <dd>{active.estimatedMonthlyBookings || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400">
                      Massage Services Interested In
                    </dt>
                    <dd>
                      {active.massageServicesInterested?.length
                        ? active.massageServicesInterested.join(", ")
                        : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-400">
                      Adequate Space for Massage Table
                    </dt>
                    <dd>{active.adequateSpaceForTable || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400">
                      Preferred Payment Arrangement
                    </dt>
                    <dd>{active.preferredPaymentArrangement || "—"}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-primary font-semibold mb-2 border-b border-gray-800 pb-1">
                  Additional Information
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-gray-400">How they heard about us</dt>
                    <dd>{active.heardAboutUs || "—"}</dd>
                  </div>
                  {active.additionalNotes && (
                    <div>
                      <dt className="text-gray-400">
                        Additional Comments or Questions
                      </dt>
                      <dd className="whitespace-pre-wrap bg-[#0d0d0d] border border-gray-800 rounded p-3 mt-1">
                        {active.additionalNotes}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <dt className="text-gray-400">Received</dt>
                <dd>{new Date(active.createdAt).toLocaleString()}</dd>
              </div>
            </div>

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
