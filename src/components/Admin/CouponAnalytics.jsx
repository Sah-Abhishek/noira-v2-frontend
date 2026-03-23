import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart3,
  TrendingDown,
  Ticket,
  ShoppingCart,
  PoundSterling,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export default function CouponAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const adminjwt = localStorage.getItem("adminjwt");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${apiUrl}/admin/coupon-analytics`, {
          headers: { Authorization: `Bearer ${adminjwt}` },
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching coupon analytics:", err);
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex items-center justify-center">
        <p className="text-primary">Loading coupon analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const { summary, perCoupon, recentBookings } = data;

  const getTypeBadge = (type, value) => {
    if (type === "percentage")
      return { label: `${value}% off`, cls: "bg-blue-500/20 text-blue-400" };
    if (type === "fixed")
      return { label: `£${value} off`, cls: "bg-purple-500/20 text-purple-400" };
    return { label: "Free", cls: "bg-green-500/20 text-green-400" };
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatDateTime = (d) =>
    new Date(d).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  // Compute a simple bar width for the visual chart
  const maxBookings = perCoupon.length > 0
    ? Math.max(...perCoupon.map((c) => c.totalBookings))
    : 1;

  return (
    <div className="min-h-screen bg-[#111] text-white p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/admin/couponmanagement")}
          className="p-2 rounded-lg bg-[#0d0d0d] border border-white/10 hover:border-primary/40 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Coupon Analytics</h1>
          <p className="text-white/50 text-sm">
            Track how promo codes are performing across bookings
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <StatCard
          icon={<ShoppingCart size={20} />}
          label="Bookings with Coupons"
          value={summary.totalDiscountedBookings}
          accent="text-primary"
        />
        <StatCard
          icon={<TrendingDown size={20} />}
          label="Total Discount Given"
          value={`£${summary.totalDiscountGiven.toFixed(2)}`}
          accent="text-red-400"
        />
        <StatCard
          icon={<PoundSterling size={20} />}
          label="Revenue (after discount)"
          value={`£${summary.totalRevenueWithCoupons.toFixed(2)}`}
          accent="text-green-400"
        />
        <StatCard
          icon={<BarChart3 size={20} />}
          label="Avg Discount / Booking"
          value={`£${summary.avgDiscount.toFixed(2)}`}
          accent="text-blue-400"
        />
        <StatCard
          icon={<Ticket size={20} />}
          label="Most Used Coupon"
          value={summary.mostUsedCoupon}
          accent="text-yellow-400"
        />
      </div>

      {/* Per-Coupon Breakdown */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Per-Coupon Breakdown</h2>

        {perCoupon.length === 0 ? (
          <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-12 text-center text-white/40">
            <Ticket size={40} className="mx-auto mb-3" />
            <p>No coupon usage data yet</p>
          </div>
        ) : (
          <>
            {/* Visual bar chart */}
            <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-6 mb-6">
              <p className="text-white/40 text-xs mb-4 uppercase tracking-wider">
                Redemptions by Coupon
              </p>
              <div className="space-y-3">
                {perCoupon.map((c) => (
                  <div key={c.code} className="flex items-center gap-3">
                    <span className="w-24 text-xs font-mono text-white/80 truncate text-right">
                      {c.code}
                    </span>
                    <div className="flex-1 bg-[#1a1a1a] rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                        style={{
                          width: `${Math.max((c.totalBookings / maxBookings) * 100, 8)}%`,
                        }}
                      >
                        <span className="text-[10px] font-bold text-black">
                          {c.totalBookings}
                        </span>
                      </div>
                    </div>
                    <span className="w-20 text-xs text-white/50 text-right">
                      £{c.totalDiscount.toFixed(0)} saved
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 text-left">
                    <th className="pb-3 pr-4">Code</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4 text-right">Bookings</th>
                    <th className="pb-3 pr-4 text-right">Total Discount</th>
                    <th className="pb-3 pr-4 text-right">Revenue Generated</th>
                    <th className="pb-3 pr-4 text-right">Usage</th>
                    <th className="pb-3 text-right">Last Used</th>
                  </tr>
                </thead>
                <tbody>
                  {perCoupon.map((c) => {
                    const badge = getTypeBadge(c.type, c.value);
                    return (
                      <tr
                        key={c.code}
                        className="border-b border-white/5 hover:bg-white/5 transition"
                      >
                        <td className="py-3 pr-4 font-mono font-bold tracking-wider">
                          {c.code}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${badge.cls}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              c.isActive
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {c.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-right text-white/80">
                          {c.totalBookings}
                        </td>
                        <td className="py-3 pr-4 text-right text-red-400">
                          £{c.totalDiscount.toFixed(2)}
                        </td>
                        <td className="py-3 pr-4 text-right text-green-400">
                          £{c.totalRevenue.toFixed(2)}
                        </td>
                        <td className="py-3 pr-4 text-right text-white/60">
                          {c.usedCount}
                          {c.maxUses > 0 ? ` / ${c.maxUses}` : " / ∞"}
                        </td>
                        <td className="py-3 text-right text-white/50 text-xs">
                          {c.lastUsedAt ? formatDate(c.lastUsedAt) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Recent Bookings with Coupons */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Bookings with Coupons</h2>

        {recentBookings.length === 0 ? (
          <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-12 text-center text-white/40">
            <p>No coupon bookings found yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-[#0d0d0d] border border-white/10 rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-left">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Coupon</th>
                  <th className="py-3 px-4 text-right">Discount</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr
                    key={b.bookingId}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-white/90">{b.clientName}</div>
                        <div className="text-white/40 text-xs">{b.clientEmail}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/70">{b.service}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-primary font-bold text-xs bg-primary/10 px-2 py-1 rounded">
                        {b.couponCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-red-400">
                      -£{b.discountAmount?.toFixed(2) || "0.00"}
                    </td>
                    <td className="py-3 px-4 text-right text-green-400">
                      £{b.finalPrice?.toFixed(2) || "0.00"}
                    </td>
                    <td className="py-3 px-4 text-white/60 capitalize">
                      {b.paymentMode}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          b.status === "confirmed"
                            ? "bg-green-500/20 text-green-400"
                            : b.status === "completed"
                            ? "bg-blue-500/20 text-blue-400"
                            : b.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-white/50 text-xs">
                      {formatDateTime(b.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2 text-white/40">
        {icon}
        <p className="text-xs">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}
