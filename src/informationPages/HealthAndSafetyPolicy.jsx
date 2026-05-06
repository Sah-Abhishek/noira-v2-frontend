
// src/pages/HealthAndSafety.jsx
export default function HealthAndSafety() {
  return (
    <div className="bg-[#0d0d0d] pt-10 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* Health & Safety Policy */}
        <section className="bg-[#111] p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-primary mb-4">
            NOIRA Ltd – Health & Safety Policy
          </h1>
          <p className="text-sm text-gray-400 mb-6">Effective Date: 20 Sept 2025</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong className="text-primary">Therapist Standards:</strong> All
              therapists are vetted, insured, and use sanitised equipment.
            </li>
            <li>
              <strong className="text-primary">Client Obligations:</strong> Clients
              must provide a safe space and disclose relevant health conditions.
            </li>
            <li>
              <strong className="text-primary">Hygiene:</strong> Services follow UK
              health regulations and COVID-safe protocols.
            </li>
            <li>
              <strong className="text-primary">Boundaries:</strong> Services are
              strictly therapeutic; misconduct may result in termination of services.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
