import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

export default function AdminListPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const adminjwt = localStorage.getItem("adminjwt");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get(`${apiUrl}/admin/adminlist`, {
          headers: { Authorization: `Bearer ${adminjwt}` },
        });
        setAdmins(res.data.adminProfiles || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch admins");
      } finally {
        setLoading(false);
      }
    };

    if (adminjwt) {
      fetchAdmins();
    } else {
      setError("Admin not authenticated");
      setLoading(false);
    }
  }, [adminjwt]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-primary">
        <p className="animate-pulse">Loading admins...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  if (!admins.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-gray-400">
        <p>No admins found.</p>
      </div>
    );
  }

  return (
    <div className=" bg-[#0d0d0d] py-10 px-4 text-gray-200">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-8">Admin List</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map((admin) => {
            const fullName = `${admin.name?.first || ""} ${admin.name?.last || ""}`.trim();

            return (
              <div
                key={admin._id}
                className="bg-[#111] rounded-2xl p-6 shadow-lg border border-gray-800 hover:shadow-xl transition hover:border-primary/30"
              >
                <div className="flex items-center gap-4">
                  {admin.avatar_url ? (
                    <img
                      src={admin.avatar_url}
                      alt={fullName}
                      className="w-16 h-16 rounded-full border-2 border-primary object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-primary bg-[#0d0d0d] flex-shrink-0">
                      <User size={28} className="text-gray-500" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-primary truncate">
                      {fullName || "Unnamed Admin"}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">{admin.email}</p>
                    {admin.role && (
                      <p className="text-xs text-primary/80 mt-1 capitalize">
                        {admin.role}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
