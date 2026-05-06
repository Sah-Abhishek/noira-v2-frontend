
// src/pages/CancellationPolicy.jsx
export default function CancellationPolicy() {
  return (
    <div className="bg-[#0d0d0d] pt-10 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* Cancellation & No-Show Policy */}
        <section className="bg-[#111] p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-primary mb-4">
            NOIRA Ltd – Cancellation & No-Show Policy
          </h1>
          <p className="text-sm text-gray-400 mb-6">Effective Date: 20 Sept 2025</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong className="text-primary">Cancellations:</strong> Free with
              2+ hours’ notice, otherwise restricted.
            </li>
            <li>
              <strong className="text-primary">No-Shows:</strong> Prepaid bookings are
              non-refundable; unpaid bookings require settlement.
            </li>
            <li>
              <strong className="text-primary">Respect:</strong> Clients are expected
              to value therapists’ time and commitment.
            </li>
            <li>
              <strong className="text-primary">Acknowledgement:</strong> Making a
              booking constitutes acceptance of this policy.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
