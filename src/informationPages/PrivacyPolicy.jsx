
// src/pages/PrivacyPolicy.jsx
const PrivacyPolicy = () => {
  return (
    <div className="bg-[#0d0d0d] pt-10 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* Privacy Policy */}
        <section className="bg-[#111] p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-primary mb-4">
            NOIRA Ltd – Privacy Policy
          </h1>
          <p className="text-sm text-gray-400 mb-6">Effective Date: 20 Sept 2025</p>
          <p>
            At NOIRA Ltd, London’s leading provider of luxury mobile massage
            services, we value your privacy and are committed to GDPR-compliant
            practices. This Privacy Policy explains how we collect, use, and
            safeguard your personal data.
          </p>
          <ul className="list-disc list-inside mt-4 space-y-1">
            <li>
              <strong className="text-primary">Information We Collect:</strong>{" "}
              Personal (Name, email, phone, booking details, billing address),
              Payment (via secure gateways), Technical (IP, cookies, site usage),
              Sensitive (health info if voluntarily provided).
            </li>
            <li>
              <strong className="text-primary">Use of Information:</strong>{" "}
              Bookings, service delivery, website performance, legal compliance.
            </li>
            <li>
              <strong className="text-primary">Data Sharing:</strong>{" "}
              Payment processors, therapists under agreements, legal authorities if required.
            </li>
            <li>
              <strong className="text-primary">Cookies & Tracking:</strong>{" "}
              Uses cookies + Google Analytics.
            </li>
            <li>
              <strong className="text-primary">Your Rights:</strong>{" "}
              Access, correct, delete, withdraw consent.
            </li>
            <li>
              <strong className="text-primary">Security:</strong>{" "}
              SSL, secure servers, limited access.
            </li>
            <li>
              <strong className="text-primary">Retention:</strong>{" "}
              Data kept only as necessary.
            </li>
            <li>
              <strong className="text-primary">Contact:</strong>{" "}
              NOIRA Ltd, London, info@noira.co.uk, +44 7350 700055.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
export default PrivacyPolicy;
