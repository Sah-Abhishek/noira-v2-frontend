
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-8xl font-bold text-[#C49E5B]">404</h1>
        <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>
        <p className="text-gray-400 mt-2">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center mt-6 px-6 py-3 bg-[#C49E5B] text-black font-semibold rounded-md hover:bg-yellow-400 transition"
        >
          <ArrowLeft className="mr-2" size={18} />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
