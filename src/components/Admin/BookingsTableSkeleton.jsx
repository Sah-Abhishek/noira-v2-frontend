// BookingsTableSkeleton.jsx
import React from "react";

export default function BookingsTableSkeleton({ rows = 6 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr
          key={i}
          className="border-t border-[#222] animate-pulse hover:bg-[#111]"
        >
          {Array.from({ length: 10 }).map((__, j) => ( // 10 columns
            <td key={j} className="py-3 px-4">
              <div className="h-4 w-24 bg-gray-700/40 rounded"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
