import { useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TherapistPayoutTable from "./TherapistPayoutTable.jsx";

export default function TherapistPayout() {
  const options = ["This Week", "This Month", "Custom Range"];
  const [selected, setSelected] = useState("This Week");

  // For custom range
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-[#111] px-6 py-4 flex items-center justify-between rounded-lg">
        {/* Left side title */}
        <div>
          <h1 className="text-xl font-bold text-primary">My Payment Settlement</h1>
          <p className="text-sm text-gray-400">
            Track your earnings, bookings, and settlement status
          </p>
        </div>

      </div>
      {/* Table section */}
      <TherapistPayoutTable />
    </div>
  );
}
