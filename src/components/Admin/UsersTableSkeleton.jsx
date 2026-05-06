
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaTrash, FaEdit } from "react-icons/fa";
import TableSkeleton from "./TableSkeleton"; // import skeleton

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const adminjwt = localStorage.getItem('adminjwt');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${apiUrl}/admin/users`, {
          params: { page: 1, limit: 10 }, headers: {
            Authorization: `Bearer ${adminjwt}`,
          }

        });
        setUsers(res.data.users || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">Users Management</h1>

        <div className="bg-[#111] rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0d0d0d] text-primary text-sm uppercase">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Bookings</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={8} />
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-[#222] hover:bg-[#1a1a1a] transition"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={user.avatar_url}
                        alt={user.name.first}
                        className="w-10 h-10 rounded-full object-cover border border-primary"
                      />
                      <div>
                        <p className="font-semibold text-white">
                          {user.name.first} {user.name.last}
                        </p>
                        <p className="text-xs text-gray-400">
                          ID: #{user._id.slice(-6)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4 capitalize">
                      <span className="px-3 py-1 rounded-full text-xs bg-[#222] border border-primary text-primary">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.emailVerified ? (
                        <span className="text-green-400 font-medium">
                          Verified
                        </span>
                      ) : (
                        <span className="text-red-400 font-medium">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-primary font-bold">
                        {user.bookingStats?.total || 0}
                      </span>{" "}
                      bookings
                    </td>
                    <td className="px-6 py-4 flex gap-3 text-lg">
                      <button className="text-primary hover:scale-110 transition">
                        <FaUser />
                      </button>
                      <button className="text-blue-400 hover:scale-110 transition">
                        <FaEdit />
                      </button>
                      <button className="text-red-500 hover:scale-110 transition">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500 text-sm"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
