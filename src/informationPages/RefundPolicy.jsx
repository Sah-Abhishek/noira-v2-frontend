
// src/pages/RefundPolicy.jsx
export default function RefundPolicy() {
  return (
    <div className="bg-[#0d0d0d] pt-10 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* Refund Policy */}
        <section className="bg-[#111] p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-primary mb-4">
            NOIRA Ltd – Refund Policy
          </h1>
          <p className="text-sm text-gray-400 mb-6">Effective Date: 20 Sept 2025</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong className="text-primary">Eligible Refunds:</strong> Full refunds
              for cancellations made 2+ hours before the booking. Processing takes 7–10
              business days.
            </li>
            <li>
              <strong className="text-primary">Non-Refundable:</strong> No-shows and
              services already delivered are not eligible for refunds.
            </li>
            <li>
              <strong className="text-primary">Refund Method:</strong> Issued only to
              the original payment method used at booking.
            </li>
            <li>
              <strong className="text-primary">Discretion:</strong> Refunds outside this
              policy may be considered on a case-by-case basis.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
