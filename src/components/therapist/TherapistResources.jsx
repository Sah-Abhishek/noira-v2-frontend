
import React from "react";
import { Download } from "lucide-react";

// Example resource data
const resources = [
  {
    id: 1,
    title: "Massage Therapy Guide",
    description: "A complete guide to massage therapy practices and benefits.",
    pdfUrl: "/pdfs/noira_massage_setup_updated.pdf", // Make sure this file is placed in /public/pdfs/
  },
];

export default function ResourcesPage() {
  return (
    <section className="min-h-screen bg-[#111] text-white py-16 px-6 md:px-20">
      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Explore Our <span className="text-primary">Resources</span>
        </h1>
        <p className="mt-4 text-gray-400">
          Download guides and resources to enhance your wellness journey
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((res) => (
          <div
            key={res.id}
            className="bg-[#0d0d0d] border border-primary/20 rounded-2xl p-6 shadow-lg hover:shadow-primary/30 transition-all duration-300"
          >
            <h2 className="text-xl font-bold text-primary mb-3">{res.title}</h2>
            <p className="text-gray-400 text-sm mb-6">{res.description}</p>

            <a
              href={res.pdfUrl}
              download
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary text-black font-semibold hover:bg-amber-500 transition"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
