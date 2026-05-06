import React, { useState, useEffect, Fragment } from "react";
import {
  Filter,
  RotateCcw,
  FileSpreadsheet,
  FileText,
  Check,
  ChevronDown,
} from "lucide-react";
import { Combobox, Transition } from "@headlessui/react";
import FancyDropdown from "../../browseTherapist/FancyDropdown.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StatusCardsSettlementReports from "./StatusCardsSettlementReports.jsx";
import SettlementReportsTable from "./SettlementReportsTable.jsx";

export default function SettlementReportsPage() {
  // draft filter states (UI controls)
  const [dateRange, setDateRange] = useState("Last Week");
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [therapist, setTherapist] = useState(null);
  const [paymentMode, setPaymentMode] = useState("All Modes");
  const [settlementStatus, setSettlementStatus] = useState("All Status");

  const apiUrl = import.meta.env.VITE_API_URL;

  // therapist search
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const normalizeToUTC = (date) => {
    if (!date) return null;
    // Simply format the local date string and parse it as UTC
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    // Parse as UTC by appending 'T00:00:00Z'
    return new Date(`${year}-${month}-${day}T00:00:00Z`);
  };

  // helper: format date to YYYY-MM-DD (UTC)
  // force UTC YYYY-MM-DD (ignores local timezone)
  const formatDate = (date) => {
    if (!date) return null;
    // Directly format UTC date components to YYYY-MM-DD
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // get last week's Monday (00:00 UTC) to Sunday (23:59 UTC)
  const getLastWeekRange = () => {
    const today = new Date();
    const utcDay = today.getUTCDay(); // 0=Sun, 1=Mon ... 6=Sat

    // get last Monday UTC
    const lastMonday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    lastMonday.setUTCDate(today.getUTCDate() - utcDay - 6);

    // last Sunday UTC (end of day)
    const lastSunday = new Date(lastMonday);
    lastSunday.setUTCDate(lastMonday.getUTCDate() + 6);

    return { start: lastMonday, end: lastSunday };
  };

  // get last month's 1st (00:00 UTC) to last date (23:59 UTC)
  const getLastMonthRange = () => {
    const today = new Date();

    const firstDayLastMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1));
    const lastDayLastMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 0));

    return { start: firstDayLastMonth, end: lastDayLastMonth };
  };

  const getDefaultFilters = () => {
    const { start, end } = getLastWeekRange();
    return {
      startDate: formatDate(start),
      endDate: formatDate(end),
      therapistId: null,
      paymentMode: "All modes",
      settlementStatus: "All status",
    };
  };

  const [appliedFilters, setAppliedFilters] = useState(getDefaultFilters());
  console.log("These are the applied filters: ", appliedFilters);

  // fetch therapists
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const fetchTherapists = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${apiUrl}/therapist/getalltherapistsnames?q=${query}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (data.success) setSuggestions(data.data || []);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    };




    const timeout = setTimeout(fetchTherapists, 300);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const handleExportPDF = async () => {
    if (!therapist) return;

    try {
      const res = await fetch(
        `${apiUrl}/payout/admin/weekly-settlement/pdf?therapistId=${therapist.id}&startDate=${appliedFilters.startDate}&endDate=${appliedFilters.endDate}`,
        {
          method: "GET",
        }
      );

      if (!res.ok) throw new Error("Failed to export PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `settlement-report-${therapist.name}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting PDF:", err);
    }
  };

  // helper: build filters object
  const buildFilters = () => {
    let startDate, endDate;

    if (dateRange === "Last Week") {
      const { start, end } = getLastWeekRange();
      startDate = start;
      endDate = end;
    } else if (dateRange === "Last Month") {
      const { start, end } = getLastMonthRange();
      startDate = start;
      endDate = end;
    } else if (dateRange === "Custom Range") {
      startDate = customStartDate;
      endDate = customEndDate;
    }

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      therapistId: therapist?.id || null,
      paymentMode: paymentMode !== "All Modes" ? paymentMode : null,
      settlementStatus: settlementStatus !== "All Status" ? settlementStatus : null,
    };
  };

  return (
    <div>
      <section className="bg-[#0d0d0d] min-h-screen py-6 px-6">
        {/* Header */}
        <div className="mx-auto border-b border-[#1a1a1a] pb-4 mb-6">
          <h1 className="text-xl font-semibold text-primary">
            Payment Settlement Report
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Track bookings, commissions, and settlement status
          </p>
        </div>

        <StatusCardsSettlementReports filters={appliedFilters} />

        {/* Filters Section */}
        <div className="bg-[#111] p-6 mt-10 rounded-lg shadow-lg border border-[#1a1a1a]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Date Range */}
            <div className="col-span-1">
              <FancyDropdown
                label="Date Range"
                options={["Last Week", "Last Month", "Custom Range"]}
                value={dateRange}
                onChange={setDateRange}
              />

              {/* Show custom date pickers */}
              {dateRange === "Custom Range" && (
                <div className="mt-3 flex gap-2">
                  <div className="flex flex-col w-1/2">
                    <label className="text-xs text-gray-400 mb-1">Start</label>
                    <DatePicker
                      selected={customStartDate}
                      onChange={(date) => setCustomStartDate(normalizeToUTC(date))}
                      selectsStart
                      startDate={customStartDate}
                      endDate={customEndDate}
                      className="w-full rounded-md bg-black/60 border border-white/10 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Start date"
                    />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label className="text-xs text-gray-400 mb-1">End</label>
                    <DatePicker
                      selected={customEndDate}
                      onChange={(date) => setCustomEndDate(normalizeToUTC(date))}
                      selectsEnd
                      startDate={customStartDate}
                      endDate={customEndDate}
                      minDate={customStartDate}
                      className="w-full rounded-md bg-black/60 border border-white/10 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="End date"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Therapist Searchable Dropdown */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Therapist
              </label>
              <Combobox value={therapist} onChange={setTherapist}>
                <div className="relative">
                  <Combobox.Input
                    className="w-full rounded-md bg-black/60 border border-white/10 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-black"
                    placeholder="Search therapist..."
                    displayValue={(t) => t?.name || ""}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-75"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Combobox.Options className="absolute mt-2 w-full rounded-md bg-[#0d0d0d] border border-white/10 shadow-lg z-50 max-h-48 overflow-y-auto">
                      {loading && (
                        <div className="px-3 py-2 text-sm text-gray-400">
                          Loading...
                        </div>
                      )}
                      {!loading && suggestions.length === 0 && query !== "" && (
                        <div className="px-3 py-2 text-sm text-gray-400">
                          No results
                        </div>
                      )}
                      {suggestions.map((t) => (
                        <Combobox.Option
                          key={t.id}
                          value={t}
                          className={({ active }) =>
                            `cursor-pointer select-none px-3 py-2 text-sm ${active
                              ? "bg-primary/20 text-primary"
                              : "text-gray-200"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <div className="flex justify-between items-center">
                              <span>{t.name}</span>
                              {selected && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </div>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </Transition>
                </div>
              </Combobox>
            </div>

            {/* Payment Mode */}
            <FancyDropdown
              label="Payment Mode"
              options={["All Modes", "Cash", "Card", "UPI"]}
              value={paymentMode}
              onChange={setPaymentMode}
            />

            {/* Settlement Status */}
            <FancyDropdown
              label="Settlement Status"
              options={["All Status", "Settled", "Pending"]}
              value={settlementStatus}
              onChange={setSettlementStatus}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="flex items-center gap-2 bg-primary text-black font-medium px-4 py-2 rounded-md hover:opacity-90 transition"
              onClick={() => setAppliedFilters(buildFilters())}
            >
              <Filter className="w-4 h-4" /> Apply Filters
            </button>

            <button
              className="flex items-center gap-2 bg-[#1a1a1a] text-gray-300 font-medium px-4 py-2 rounded-md hover:bg-[#222] transition"
              onClick={() => {
                setDateRange("Last Week");
                setCustomStartDate(null);
                setCustomEndDate(null);
                setTherapist(null);
                setQuery("");
                setPaymentMode("All Modes");
                setSettlementStatus("All Status");
                setAppliedFilters(getDefaultFilters()); // reset to defaults
              }}
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>

            <div className="ml-auto flex gap-3">
              {/*         <button */}
              {/*           disabled={!therapist} */}
              {/*           className={`flex items-center gap-2 font-medium px-4 py-2 rounded-md transition */}
              {/* ${therapist */}
              {/*               ? "bg-green-600 text-white hover:bg-green-700" */}
              {/*               : "bg-gray-600 text-gray-300 cursor-not-allowed" */}
              {/*             }`} */}
              {/*         > */}
              {/*           <FileSpreadsheet className="w-4 h-4" /> Export Excel */}
              {/*         </button> */}

              <button
                disabled={!therapist}
                onClick={handleExportPDF}

                className={`flex items-center gap-2 font-medium px-4 py-2 rounded-md transition
      ${therapist
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                  }`}
              >
                <FileText className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Status cards only after Apply Filters */}
        {appliedFilters && (
          <>
            <SettlementReportsTable filters={appliedFilters} apiUrl={apiUrl} />
          </>
        )}
      </section>
    </div>
  );
}
