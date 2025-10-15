
// src/pages/CodeOfEthics.jsx
export default function CodeOfEthics() {
  return (
    <div className="bg-[#0d0d0d] pt-10 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* Code of Ethics & Client Conduct */}
        <section className="bg-[#111] p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-primary mb-4">
            NOIRA Ltd – Code of Ethics & Client Conduct
          </h1>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong className="text-primary">Respect & Dignity:</strong> Every
              client and therapist is treated with courtesy and equality.
            </li>
            <li>
              <strong className="text-primary">Professional Excellence:</strong>{" "}
              Services are delivered to the highest standards.
            </li>
            <li>
              <strong className="text-primary">Boundaries:</strong> Strictly
              professional, non-sexual interactions at all times.
            </li>
            <li>
              <strong className="text-primary">Confidentiality:</strong> Client
              information and data are never misused or shared without consent.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
