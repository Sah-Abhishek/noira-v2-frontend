import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, TrendingUp, Search, Filter } from "lucide-react";
import { toast } from "react-hot-toast";

const PERIOD_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "All Time", value: "all" },
];

export default function PostcodeAnalytics() {
  const [data, setData] = useState({
    topPostcodes: [],
    topOutcodes: [],
    totalSearches: 0,
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");
  const [view, setView] = useState("postcodes"); // "postcodes" | "areas"

  const apiUrl = import.meta.env.VITE_API_URL;
  const adminjwt = localStorage.getItem("adminjwt");
  const headers = { Authorization: `Bearer ${adminjwt}` };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/admin/postcode-analytics?period=${period}&limit=20`,
        { headers }
      );
      setData(res.data);
    } catch (error) {
      toast.error("Failed to load postcode analytics");
      console.error("Error fetching postcode analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const maxCount =
    view === "postcodes"
      ? data.topPostcodes[0]?.count || 1
      : data.topOutcodes[0]?.count || 1;

  const items =
    view === "postcodes" ? data.topPostcodes : data.topOutcodes;

  return (
    <div className="p-6 md:p-8 text-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            Postcode Analytics
          </h1>
          <p className="text-gray-400 mt-1">
            Most searched postcodes by users
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg p-1">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                period === opt.value
                  ? "bg-primary text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Searches</p>
              <p className="text-2xl font-bold">
                {loading ? "..." : data.totalSearches.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Top Postcode</p>
              <p className="text-2xl font-bold">
                {loading
                  ? "..."
                  : data.topPostcodes[0]?.postcode || "N/A"}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Top Area</p>
              <p className="text-2xl font-bold">
                {loading
                  ? "..."
                  : data.topOutcodes[0]?.outcode || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400 mr-2">View by:</span>
        <button
          onClick={() => setView("postcodes")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
            view === "postcodes"
              ? "bg-primary text-black"
              : "bg-[#1a1a1a] text-gray-400 hover:text-white"
          }`}
        >
          Full Postcodes
        </button>
        <button
          onClick={() => setView("areas")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
            view === "areas"
              ? "bg-primary text-black"
              : "bg-[#1a1a1a] text-gray-400 hover:text-white"
          }`}
        >
          Area Codes
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No postcode searches recorded yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                <th className="px-6 py-4 w-16">#</th>
                <th className="px-6 py-4">
                  {view === "postcodes" ? "Postcode" : "Area Code"}
                </th>
                <th className="px-6 py-4">Searches</th>
                <th className="px-6 py-4 hidden sm:table-cell">Popularity</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const label =
                  view === "postcodes" ? item.postcode : item.outcode;
                const pct = Math.round((item.count / maxCount) * 100);
                return (
                  <tr
                    key={label}
                    className="border-b border-gray-800/50 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4 text-gray-500 font-mono">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 font-semibold">{label}</td>
                    <td className="px-6 py-4 text-primary font-medium">
                      {item.count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-10 text-right">
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
