import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Percent,
  Coins,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import axios from "axios";

export default function StatusCardsSettlementReports({ filters }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  const endPoint = `${apiUrl}/payout/admin/summary`;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await axios.get(endPoint, { params: filters });
        if (res.data?.summaryMetrics) {
          setMetrics(res.data.summaryMetrics);
        }
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [filters]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#111] p-4 rounded-lg border border-[#1a1a1a] h-24 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
      {/* Total Bookings */}
      <div className="bg-[#111] p-4 rounded-xl border border-[#1a1a1a] flex items-stretch justify-between">
        <div className="flex flex-col justify-center">
          <p className="text-sm text-gray-400">Total Pending Settlements</p>
          <p className="text-2xl font-semibold text-white">
            {metrics.totalBookings}
          </p>
        </div>
        <div className="flex items-center">
          <CalendarDays className="w-10 h-10 text-white opacity-80" />
        </div>
      </div>

      {/* Company Commission */}
      <div className="bg-[#111] p-4 rounded-xl border border-[#1a1a1a] flex items-stretch justify-between">
        <div className="flex flex-col justify-center">
          <p className="text-sm text-gray-400">Company Commission</p>
          <p className="text-2xl font-semibold text-yellow-400">
            {formatCurrency(metrics.companyCommission)}
          </p>
        </div>

        {/*   <Percent className="w-10 h-10 text-yellow-400 opacity-80" /> */}
        {/* </div> */}
      </div>

      {/* Therapist Earnings */}
      <div className="bg-[#111] p-4 rounded-xl border border-[#1a1a1a] flex items-stretch justify-between">
        <div className="flex flex-col justify-center">
          <p className="text-sm text-gray-400">Therapist Earnings</p>
          <p className="text-2xl font-semibold text-green-500">
            {formatCurrency(metrics.therapistEarnings)}
          </p>
        </div>
        <div className="flex items-center">
          <Coins className="w-10 h-10 text-primary opacity-80" />
        </div>
      </div>

      {/* Net Payable */}
      <div className="bg-[#111] p-4 rounded-xl border border-[#1a1a1a] flex items-stretch justify-between">
        <div className="flex flex-col justify-center">
          <p className="text-sm text-gray-400">Net Payable</p>
          <p className="text-2xl font-semibold text-green-500">
            {formatCurrency(metrics.netPayable)}
          </p>
        </div>
        <div className="flex items-center">
          <ArrowUp className="w-10 h-10 text-green-500 opacity-80" />
        </div>
      </div>

      {/* Net Receivable */}
      <div className="bg-[#111] p-4 rounded-xl border border-[#1a1a1a] flex items-stretch justify-between">
        <div className="flex flex-col justify-center">
          <p className="text-sm text-gray-400">Net Receivable</p>
          <p className="text-2xl font-semibold text-red-500">
            {formatCurrency(metrics.netReceivable)}
          </p>
        </div>
        <div className="flex items-center">
          <ArrowDown className="w-10 h-10 text-red-500 opacity-80" />
        </div>
      </div>
    </div>
  );
}
