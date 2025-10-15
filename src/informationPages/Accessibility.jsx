
// src/pages/Accessibility.jsx
export default function Accessibility() {
  return (
    <div className="bg-[#0d0d0d] pt-10 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* Accessibility & Inclusivity Statement */}
        <section className="bg-[#111] p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-primary mb-4">
            NOIRA Ltd – Accessibility & Inclusivity Statement
          </h1>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong className="text-primary">Accessibility:</strong> We strive to
              comply with WCAG standards and provide alternative booking support
              for clients with additional needs.
            </li>
            <li>
              <strong className="text-primary">Inclusivity:</strong> Our services are
              open to all clients, and we are committed to diverse and inclusive
              hiring practices.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
