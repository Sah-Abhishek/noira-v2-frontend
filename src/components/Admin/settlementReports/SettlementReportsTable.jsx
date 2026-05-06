import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SettlementReportsTable({ filters, apiUrl }) {
  const [activeTab, setActiveTab] = useState("booking"); // booking | weekly
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Booking-wise Report
  const fetchBookingReports = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...filters,
      });

      const res = await fetch(
        `${apiUrl}/payout/admin/reports/booking-wise?${params}`
      );
      const json = await res.json();

      if (json.data) {
        setData(json.data);
        setPagination({
          currentPage: json.page,
          limit: json.limit,
          totalDocuments: json.totalCount,
          totalPages: json.totalPages,
        });
      }
    } catch (err) {
      console.error("Error fetching booking reports:", err);
    } finally {
      setLoading(false);
    }
  };


  // Mark weekly settlement
  const markWeeklySettlement = async (therapistId) => {
    try {
      setLoading(true);

      const res = await fetch(`${apiUrl}/payout/admin/marksettleweek`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: filters.startDate,
          endDate: filters.endDate,
          therapistId,
        }),
      });

      const json = await res.json();

      if (res.ok) {
        console.log("Weekly settlement success:", json.message || json);
        // Refresh weekly reports
        fetchWeeklyReports(pagination?.currentPage || 1);
      } else {
        console.error("Settlement failed:", json);
        toast.error(json.message || "Failed to mark weekly settlement");
      }
    } catch (err) {
      console.error("Error marking weekly settlement:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // inside SettlementReportsTable component

  // Mark booking as settled
  const markBookingSettledBookingId = async (bookingId) => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/payout/admin/marksettlebyid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId }),
      });

      const json = await res.json();

      if (res.ok) {
        console.log("Settlement success:", json.message || json);
        // Refresh booking report
        fetchBookingReports(pagination?.currentPage || 1);
      } else {
        console.error("Settlement failed:", json);
        toast.error(json.message || "Failed to mark settled");
      }
    } catch (err) {
      console.error("Error marking settled:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // Fetch Weekly Settlement Report
  const fetchWeeklyReports = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...filters,
      });

      const res = await fetch(
        `${apiUrl}/payout/admin/reports/weekly-summary?${params}`
      );
      const json = await res.json();

      if (json.data) {
        setData(json.data);
        setPagination({
          currentPage: json.pagination?.page,
          limit: json.pagination?.limit,
          totalDocuments: json.pagination?.total,
          totalPages: json.pagination?.totalPages,
        });
      }
    } catch (err) {
      console.error("Error fetching weekly reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "booking") {
      fetchBookingReports(1);
    } else if (activeTab === "weekly") {
      fetchWeeklyReports(1);
    }
  }, [filters, activeTab]);

  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="flex mb-6">
        <button
          className={`px-6 py-2 rounded-t-md font-medium ${activeTab === "booking"
            ? "bg-primary text-black"
            : "bg-[#111] text-gray-300"
            }`}
          onClick={() => setActiveTab("booking")}
        >
          Booking-wise Report
        </button>
        <button
          className={`px-6 py-2 rounded-t-md font-medium ml-2 ${activeTab === "weekly"
            ? "bg-primary text-black"
            : "bg-[#111] text-gray-300"
            }`}
          onClick={() => setActiveTab("weekly")}
        >
          Weekly Pending Settlement
        </button>
      </div>

      <div className="bg-[#111] rounded-lg shadow-lg border border-[#1a1a1a] p-4">
        {/* Booking-wise Report */}
        {activeTab === "booking" && (
          <>
            {loading ? (
              <div className="text-gray-400 text-sm p-6">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-[#1a1a1a]">
                      <th className="py-3 px-2">Booking ID</th>
                      <th className="py-3 px-2">Client Name</th>
                      <th className="py-3 px-2">Therapist</th>
                      <th className="py-3 px-2">Service</th>
                      <th className="py-3 px-2">Amount</th>
                      <th className="py-3 px-2">Payment Mode</th>
                      <th className="py-3 px-2">Company Share</th>
                      <th className="py-3 px-2">Therapist Share</th>
                      <th className="py-3 px-2">Net Settlement</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row) => (
                      <tr
                        key={row.bookingId}
                        className="border-b border-[#1a1a1a] text-gray-200"
                      >
                        <td className="py-2 px-2">#{row.bookingId}</td>
                        <td className="py-2 px-2">
                          {row.clientName?.first} {row.clientName?.last}
                        </td>
                        <td className="py-2 px-2">{row.therapist}</td>
                        <td className="py-2 px-2">{row.service}</td>
                        <td className="py-2 px-2 font-medium">
                          £{row.amount?.toLocaleString()}
                        </td>
                        <td className="py-2 px-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium capitalize ${row.paymentMode === "online"
                              ? "bg-blue-600/20 text-blue-400"
                              : "bg-green-600/20 text-green-400"
                              }`}
                          >
                            {row.paymentMode}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-yellow-400">
                          £{row.companyShare?.toLocaleString()}
                        </td>
                        <td className="py-2 px-2 text-green-400">
                          £{row.therapistShare?.toLocaleString()}
                        </td>
                        <td
                          className={`py-2 px-2 font-medium ${row.netSettlement >= 0 ? "text-red-400" : "text-green-400"
                            }`}
                        >
                          {row.netSettlement >= 0 ? "-" : "+"}
                          £{Math.abs(row.netSettlement).toLocaleString()}
                          {row.netSettlement >= 0 ? " (pay)" : " (collect)"}

                        </td>
                        <td className="py-2 px-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === "Settled"
                              ? "bg-green-600/20 text-green-400"
                              : "bg-yellow-600/20 text-yellow-400"
                              }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-2 px-2 flex gap-2">
                          {row.actions?.includes("Mark Settled") ? (
                            <button
                              onClick={() => markBookingSettledBookingId(row.bookingId)}
                              className="bg-primary text-black px-3 py-1 rounded-md text-xs font-medium"
                            >
                              Mark Settled
                            </button>
                          ) : (
                            <button
                              className="bg-gray-800 text-gray-400 px-3 py-1 rounded-md text-xs cursor-not-allowed"
                              disabled
                            >
                              Settled
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Weekly Settlement Report */}
        {activeTab === "weekly" && (
          <>
            {loading ? (
              <div className="text-gray-400 text-sm p-6">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-200">
                    Weekly Settlement Summary
                  </h2>
                  {/* <button className="bg-primary text-black px-4 py-2 rounded-md text-sm font-medium"> */}
                  {/*   Bulk Settle All Pending */}
                  {/* </button> */}
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-[#1a1a1a]">
                      <th className="py-3 px-2">Therapist</th>
                      <th className="py-3 px-2">Total Unsettled Bookings</th>
                      <th className="py-3 px-2">Total Online (Payable)</th>
                      <th className="py-3 px-2">Total Cash (Receivable)</th>
                      <th className="py-3 px-2">Net Settlement</th>
                      <th className="py-3 px-2">Settlement Status</th>
                      <th className="py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row) => {
                      const isPay = row.netSettlement >= 0;
                      return (
                        <tr
                          key={row.therapistId}
                          className="border-b border-[#1a1a1a] text-gray-200"
                        >
                          <td className="py-2 px-2 font-medium">
                            {row.therapist}
                          </td>
                          <td className="py-2 px-2">{row.totalBookings}</td>
                          <td className="py-2 px-2 text-green-400">
                            £{row.totalOnlinePayable?.toLocaleString()}
                          </td>
                          <td className="py-2 px-2 text-red-400">
                            £{row.totalCashReceivable?.toLocaleString()}
                          </td>
                          <td
                            className={`py-2 px-2 font-medium ${isPay ? "text-green-400" : "text-red-400"
                              }`}
                          >
                            {isPay ? "Pay" : "Collect"} £
                            {Math.abs(row.netSettlement).toLocaleString()}
                          </td>
                          <td className="py-2 px-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${row.settlementStatus === "SETTLED"
                                ? "bg-green-600/20 text-green-400"
                                : "bg-yellow-600/20 text-yellow-400"
                                }`}
                            >
                              {row.settlementStatus}
                            </span>
                          </td>
                          {row.settlementStatus === "PENDING" ? (
                            <button
                              onClick={() => markWeeklySettlement(row.therapistId)}
                              className="bg-primary text-black px-3 py-1 rounded-md text-xs font-medium"
                            >
                              Settle Now
                            </button>
                          ) : (
                            <button
                              className="bg-gray-800 text-gray-400 px-3 py-1 rounded-md text-xs cursor-not-allowed"
                              disabled
                            >
                              Settled
                            </button>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {pagination && (
          <div className="flex justify-between items-center mt-4 text-gray-400 text-sm">
            <span>
              Showing {(pagination.currentPage - 1) * pagination.limit + 1}-
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalDocuments
              )}{" "}
              of {pagination.totalDocuments}
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() =>
                  activeTab === "booking"
                    ? fetchBookingReports(pagination.currentPage - 1)
                    : fetchWeeklyReports(pagination.currentPage - 1)
                }
                className="px-3 py-1 rounded-md bg-[#1a1a1a] hover:bg-[#222] disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() =>
                  activeTab === "booking"
                    ? fetchBookingReports(pagination.currentPage + 1)
                    : fetchWeeklyReports(pagination.currentPage + 1)
                }
                className="px-3 py-1 rounded-md bg-[#1a1a1a] hover:bg-[#222] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
