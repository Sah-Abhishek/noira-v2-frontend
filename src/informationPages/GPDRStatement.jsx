
// src/pages/GDPRStatement.jsx
export default function GDPRStatement() {
  return (
    <div className="bg-[#0d0d0d] pt-10 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* GDPR Data Protection Statement */}
        <section className="bg-[#111] p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-primary mb-4">
            NOIRA Ltd – GDPR Data Protection Statement
          </h1>
          <p className="text-sm text-gray-400 mb-6">Effective Date: 20 Sept 2025</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong className="text-primary">Data Rights:</strong> You have the right to access, rectify, erase, restrict, port, and object to processing of your data.
            </li>
            <li>
              <strong className="text-primary">Consent:</strong> Marketing and promotional communication requires explicit opt-in consent.
            </li>
            <li>
              <strong className="text-primary">Accountability:</strong> Our Data Protection Officer can be contacted at +44 7350 700055.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
