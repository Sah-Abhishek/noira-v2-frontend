import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { Fragment } from "react";

export default function FancyDropdown({ label, options, value, onChange }) {
  return (
    <div className="w-full">
      <label className="block text-sm text-gray-300 mb-2">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          {/* Trigger */}
          <Listbox.Button
            className="w-full flex items-center justify-between rounded-md bg-black/60 border border-white/10 px-3 py-2 text-sm text-gray-200 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-black"
          >
            <span>{value}</span>
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Listbox.Button>

          {/* Dropdown menu */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Listbox.Options
              className="absolute mt-2 w-full rounded-md bg-[#0d0d0d] border border-white/10 shadow-lg focus:outline-none z-50 overflow-hidden"
            >
              {options.map((opt, idx) => (
                <Listbox.Option
                  key={idx}
                  value={opt}
                  className={({ active, selected }) =>
                    `relative cursor-pointer select-none px-3 py-2 text-sm ${active
                      ? "bg-primary/20 text-primary"
                      : "text-gray-200"
                    } ${selected ? "font-semibold" : ""}`
                  }
                >
                  {({ selected }) => (
                    <div className="flex justify-between items-center">
                      <span>{opt}</span>
                      {selected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
