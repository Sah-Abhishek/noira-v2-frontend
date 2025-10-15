import { useEffect, useState } from "react";
import axios from "axios";
import { Tab } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// remove null, empty, or "All" values from params
const cleanParams = (params) => {
  const copy = { ...params };
  Object.keys(copy).forEach((key) => {
    if (
      copy[key] === null ||
      copy[key] === "" ||
      copy[key] === "All Modes" ||
      copy[key] === "All Status"
    ) {
      delete copy[key];
    }
  });
  return copy;
};

// format date as YYYY-MM-DD in UTC
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

// Compute startDate & endDate based on selected range (UTC/GMT)
const getDateRange = (range, filters) => {
  const today = new Date();
  let start, end;

  const normalized = range?.trim().toLowerCase();

  if (normalized === "this week") {
    // Calculate Monday (UTC)
    const day = today.getUTCDay(); // 0=Sun, 1=Mon, ...
    const diffToMonday = day === 0 ? -6 : 1 - day;

    start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + diffToMonday));
    end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + 6));

  } else if (normalized === "this month") {
    // First day of the month (UTC)
    start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
    // Last day of the month (UTC)
    end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0));

  } else {
    // Custom range (convert to UTC midnight)
    start = filters.startDate
      ? new Date(Date.UTC(new Date(filters.startDate).getUTCFullYear(), new Date(filters.startDate).getUTCMonth(), new Date(filters.startDate).getUTCDate()))
      : today;

    end = filters.endDate
      ? new Date(Date.UTC(new Date(filters.endDate).getUTCFullYear(), new Date(filters.endDate).getUTCMonth(), new Date(filters.endDate).getUTCDate()))
      : today;
  }

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
};


export default function TherapistPayoutTable() {
  const [data, setData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weeklyLoading, setWeeklyLoading] = useState(false);
  const [services, setServices] = useState([]);
  const therapistId = localStorage.getItem("therapistId");
  const [activeTab, setActiveTab] = useState(0); // 0 = booking-wise, 1 = weekly
  const apiUrl = import.meta.env.VITE_API_URL;

  const [filters, setFilters] = useState({
    dateRange: "This Month",
    serviceId: null,
    paymentMode: "All Modes",
    settlementStatus: "All Status",
    search: "",
    page: 1,
    limit: 20,
    startDate: null,
    endDate: null,
  });

  const endPoint = `${apiUrl}/payout/therapist/reports/booking-wise`;
  const weeklyEndPoint = `${apiUrl}/payout/therapist/reports/week-summary`;

  // Booking-wise fetch - only when activeTab is 0
  useEffect(() => {
    if (activeTab !== 0) return; // Only fetch when on booking-wise tab

    const fetchData = async () => {
      try {
        setLoading(true);
        const { startDate, endDate } = getDateRange(filters.dateRange, filters);

        // strip startDate & endDate from filters so they don't override
        const { startDate: _, endDate: __, ...restFilters } = filters;

        const params = {
          therapistId,
          startDate,
          endDate,
          ...restFilters,
        };

        const res = await axios.get(endPoint, {
          params: cleanParams(params),
        });
        if (res.data?.data) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching booking-wise report:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters, therapistId, activeTab]);

  // Weekly settlement fetch - only when activeTab is 1
  useEffect(() => {
    if (activeTab !== 1) return; // Only fetch when on weekly settlement tab

    const fetchWeekly = async () => {
      try {
        setWeeklyLoading(true);
        const { startDate, endDate } = getDateRange(filters.dateRange, filters);

        const params = {
          therapistId,
          settlementStatus: filters.settlementStatus,
          page: filters.page,
          limit: filters.limit,
          startDate,
          endDate,
        };

        const res = await axios.get(weeklyEndPoint, {
          params: cleanParams(params),
        });
        if (res.data?.data) {
          setWeeklyData(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching weekly settlement:", err);
      } finally {
        setWeeklyLoading(false);
      }
    };
    fetchWeekly();
  }, [filters, therapistId, activeTab]);

  // Service list fetch
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/services/list`
        );
        if (res.data) {
          setServices(res.data);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);

  return (
    <div className="bg-[#0d0d0d] p-4 rounded-lg">
      <Tab.Group onChange={(index) => setActiveTab(index)}>
        <Tab.List className="flex space-x-2 border-b border-[#1a1a1a] mb-4">
          {["Booking-wise Report", "Weekly Settlement"].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  "px-4 py-2 rounded-t-md text-sm font-medium",
                  selected
                    ? "bg-primary text-black"
                    : "bg-[#111] text-gray-300 hover:bg-[#1a1a1a]"
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {/* Booking-wise Report */}
          <Tab.Panel>
            <div className="flex justify-end mb-4">
            </div>
            <div className="bg-[#111] p-4 rounded-md mb-6 grid grid-cols-5 gap-4">
              {/* Date Range */}
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, dateRange: e.target.value }))
                }
                className="bg-[#0d0d0d] text-gray-200 text-sm rounded-md px-3 py-2 border border-white/10 w-full"
              >
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="Custom Range">Custom Range</option>
              </select>

              {filters.dateRange === "Custom Range" && (
                <div className="flex items-center gap-2 mt-2">
                  {/* Start Date */}
                  <DatePicker
                    selected={filters.startDate ? new Date(filters.startDate) : null}
                    onChange={(date) =>
                      setFilters((f) => ({
                        ...f,
                        startDate: date ? date.toISOString().split("T")[0] : null,
                      }))
                    }
                    selectsStart
                    startDate={filters.startDate ? new Date(filters.startDate) : null}
                    endDate={filters.endDate ? new Date(filters.endDate) : null}
                    placeholderText="Start Date"
                    className="bg-[#0d0d0d] text-gray-200 text-sm rounded-md px-3 py-2 border border-white/10 w-full"
                  />

                  {/* End Date */}
                  <DatePicker
                    selected={filters.endDate ? new Date(filters.endDate) : null}
                    onChange={(date) =>
                      setFilters((f) => ({
                        ...f,
                        endDate: date ? date.toISOString().split("T")[0] : null,
                      }))
                    }
                    selectsEnd
                    startDate={filters.startDate ? new Date(filters.startDate) : null}
                    endDate={filters.endDate ? new Date(filters.endDate) : null}
                    minDate={filters.startDate ? new Date(filters.startDate) : null}
                    placeholderText="End Date"
                    className="bg-[#0d0d0d] text-gray-200 text-sm rounded-md px-3 py-2 border border-white/10 w-full"
                  />
                </div>
              )}
              {/* Payment Mode */}
              <select
                value={filters.paymentMode}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, paymentMode: e.target.value }))
                }
                className="bg-[#0d0d0d] text-gray-200 text-sm rounded-md px-3 py-2 border border-white/10"
              >
                <option>All Modes</option>
                <option>Online</option>
                <option>Cash</option>
              </select>

              {/* Settlement Status */}
              <select
                value={filters.settlementStatus}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, settlementStatus: e.target.value }))
                }
                className="bg-[#0d0d0d] text-gray-200 text-sm rounded-md px-3 py-2 border border-white/10"
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>Settled</option>
              </select>

              {/* Search */}
              {/* <input */}
              {/*   type="text" */}
              {/*   placeholder="Booking ID or Client" */}
              {/*   value={filters.search} */}
              {/*   onChange={(e) => */}
              {/*     setFilters((f) => ({ ...f, search: e.target.value })) */}
              {/*   } */}
              {/*   className="bg-[#0d0d0d] text-gray-200 text-sm rounded-md px-3 py-2 border border-white/10" */}
              {/* /> */}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-[#111] text-gray-300">
                  <tr>
                    <th className="px-4 py-3">Booking ID</th>
                    <th className="px-4 py-3">Booking Date</th>
                    <th className="px-4 py-3">Client Name</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Payment Mode</th>
                    <th className="px-4 py-3">Company Share</th>
                    <th className="px-4 py-3">My Share</th>
                    <th className="px-4 py-3">Net Settlement</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="text-center text-gray-400 py-6 animate-pulse"
                      >
                        Loading report...
                      </td>
                    </tr>
                  ) : data.length > 0 ? (
                    data.map((row) => (
                      <tr
                        key={row.bookingId}
                        className="border-b border-[#1a1a1a] hover:bg-[#111]"
                      >
                        <td className="px-4 py-3 text-primary font-medium">
                          #{row.bookingId.toUpperCase()}
                        </td>
                        <td className="px-4 py-3 text-primary font-medium">
                          {row.bookingDate.slice(0, 10)}
                        </td>
                        <td className="px-4 py-3 text-gray-200">
                          {row.clientName.first} {row.clientName.last}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {row.service}
                        </td>
                        <td className="px-4 py-3 text-white font-medium">
                          {formatCurrency(row.amount)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-md font-medium ${row.paymentMode === "online"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-green-500/20 text-green-400"
                              }`}
                          >
                            {row.paymentMode}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-red-500">
                          {formatCurrency(row.companyShare)}
                        </td>
                        <td className="px-4 py-3 text-green-500">
                          {formatCurrency(row.therapistShare)}
                        </td>
                        <td
                          className={`px-4 py-3 font-semibold ${row.netSettlement >= 0
                            ? "text-green-500"
                            : "text-red-500"
                            }`}
                        >
                          {row.netSettlement >= 0 ? "+" : ""}
                          {formatCurrency(row.netSettlement)}
                          {row.netSettlement >= 0 ? " (collect)" : " (pay)"}

                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 text-xs rounded-md font-medium ${row.status === "Pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-gray-500/20 text-gray-300"
                              }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={10}
                        className="text-center text-gray-400 py-6"
                      >
                        No booking records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Tab.Panel>

          {/* Weekly Settlement */}
          <Tab.Panel>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-[#111] text-gray-300">
                  <tr>
                    <th className="px-4 py-3">Therapist</th>
                    <th className="px-4 py-3">Bookings</th>
                    <th className="px-4 py-3">Online Received</th>
                    <th className="px-4 py-3">Cash Collected</th>
                    <th className="px-4 py-3">Commission</th>
                    <th className="px-4 py-3">Online Payable</th>
                    <th className="px-4 py-3">Cash Receivable</th>
                    <th className="px-4 py-3">Net Settlement</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyLoading ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="text-center text-gray-400 py-6 animate-pulse"
                      >
                        Loading weekly settlement...
                      </td>
                    </tr>
                  ) : weeklyData.length > 0 ? (
                    weeklyData.map((row) => (
                      <tr
                        key={row.therapistId}
                        className="border-b border-[#1a1a1a] hover:bg-[#111]"
                      >
                        <td className="px-4 py-3 text-gray-200">
                          {row.therapist}
                        </td>
                        <td className="px-4 text-white py-3">
                          {row.totalBookings ?? row.totalBookingsOverall}
                        </td>
                        <td className="px-4 py-3 text-blue-400">
                          {formatCurrency(row.totalOnlineReceived)}
                        </td>
                        <td className="px-4 py-3 text-green-400">
                          {formatCurrency(row.totalCashCollected)}
                        </td>
                        <td className="px-4 py-3 text-red-500">
                          {formatCurrency(row.totalCommission)}
                        </td>
                        <td className="px-4 py-3 text-blue-400">
                          {formatCurrency(row.totalOnlinePayable)}
                        </td>
                        <td className="px-4 py-3 text-green-400">
                          {formatCurrency(row.totalCashReceivable)}
                        </td>
                        <td
                          className={`px-4 py-3 font-semibold ${row.netSettlement >= 0
                            ? "text-green-500"
                            : "text-red-500"
                            }`}
                        >
                          {row.netSettlement >= 0 ? "+" : ""}
                          {formatCurrency(row.netSettlement)}
                          {row.netSettlement >= 0 ? " (Pay)" : " (Collect)"}

                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 text-xs rounded-md font-medium ${row.settlementStatus === "PENDING"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-gray-500/20 text-gray-300"
                              }`}
                          >
                            {row.settlementStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={10}
                        className="text-center text-gray-400 py-6"
                      >
                        No weekly settlement records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
