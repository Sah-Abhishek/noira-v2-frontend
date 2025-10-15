import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaTrash, FaEdit, FaSearch, FaCalendarAlt } from "react-icons/fa";
import FancyDropdown from "../browseTherapist/FancyDropdown";

export default function UsersManagement() {
  const [allUsers, setAllUsers] = useState([]); // Store all users from API
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users for display
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // raw input & debounced search term
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Date filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const adminjwt = localStorage.getItem('adminjwt');

  const apiUrl = import.meta.env.VITE_API_URL;

  // Debounce effect for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler); // cleanup if user keeps typing
    };
  }, [searchInput]);

  // Fetch users (only once, get all users)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${apiUrl}/admin/users`, {
          params: {
            page: 1,
            limit: 1000 // Get a large number to fetch all users
          },
          headers: {
            Authorization: `Bearer ${adminjwt}`,
          },
        });

        setAllUsers(res.data.users || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [apiUrl]);

  // Frontend filtering effect
  useEffect(() => {
    let filtered = [...allUsers];

    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(user =>
        user.name?.first?.toLowerCase().includes(searchLower) ||
        user.name?.last?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user._id.toLowerCase().includes(searchLower)
      );
    }

    // Apply date range filter
    if (startDate || endDate) {
      filtered = filtered.filter(user => {
        const userDate = new Date(user.createdAt);
        const userDateOnly = new Date(userDate.getFullYear(), userDate.getMonth(), userDate.getDate());

        let isInRange = true;

        if (startDate) {
          const start = new Date(startDate);
          isInRange = isInRange && userDateOnly >= start;
        }

        if (endDate) {
          const end = new Date(endDate);
          isInRange = isInRange && userDateOnly <= end;
        }

        return isInRange;
      });
    }

    setFilteredUsers(filtered);

    // Calculate pagination
    const totalFilteredPages = Math.ceil(filtered.length / limit);
    setTotalPages(totalFilteredPages);

    // Reset to page 1 if current page is beyond available pages
    if (page > totalFilteredPages && totalFilteredPages > 0) {
      setPage(1);
    }
  }, [allUsers, search, startDate, endDate, limit, page]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Date range presets
  const getDateRangePresets = () => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday as start of week
    startOfWeek.setDate(today.getDate() - daysToSubtract);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return {
      today: {
        start: startOfToday.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0],
        label: 'Today'
      },
      yesterday: {
        start: startOfYesterday.toISOString().split('T')[0],
        end: yesterday.toISOString().split('T')[0],
        label: 'Yesterday'
      },
      thisWeek: {
        start: startOfWeek.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0],
        label: 'This Week'
      },
      thisMonth: {
        start: startOfMonth.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0],
        label: 'This Month'
      }
    };
  };

  // Handle preset date range selection
  const handleDateRangePreset = (presetKey) => {
    if (presetKey === 'custom') {
      setSelectedDateRange('custom');
      return;
    }

    const presets = getDateRangePresets();
    const preset = presets[presetKey];

    if (preset) {
      setStartDate(preset.start);
      setEndDate(preset.end);
      setSelectedDateRange(presetKey);
      setPage(1); // Reset to first page when filter changes
    }
  };

  // Clear date filters
  const clearDateFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedDateRange("");
    setPage(1);
  };

  // Get users for current page
  const getCurrentPageUsers = () => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const currentUsers = getCurrentPageUsers();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-primary">Users Management</h1>

          {/* Search + Limit */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl bg-[#111] text-sm text-white border border-[#222] focus:border-primary outline-none"
              />
            </div>

            {/* FancyDropdown for limit */}
            <div className="w-28">
              <FancyDropdown
                label=""
                options={[5, 10, 20, 50].map((n) => `${n}/page`)}
                value={`${limit}/page`}
                onChange={(val) => {
                  const num = Number(val.replace("/page", ""));
                  setLimit(num);
                  setPage(1); // reset page on change
                }}
              />
            </div>
          </div>
        </div>

        {/* Date Filters */}
        <div className="bg-[#111] rounded-2xl p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-primary" />
              <span className="text-sm font-medium">Registration Date Filter:</span>
            </div>

            {/* Date Range Presets */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'today', label: 'Today' },
                { key: 'yesterday', label: 'Yesterday' },
                { key: 'thisWeek', label: 'This Week' },
                { key: 'thisMonth', label: 'This Month' },
                { key: 'custom', label: 'Custom Range' }
              ].map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => handleDateRangePreset(preset.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all
                    ${selectedDateRange === preset.key
                      ? "bg-primary text-black border-primary"
                      : "bg-[#0d0d0d] border-[#222] text-white hover:border-primary/50"
                    }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Date Inputs - Show only when custom is selected */}
            {selectedDateRange === 'custom' && (
              <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-[#0d0d0d] rounded-lg border border-[#222]">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400 min-w-[40px]">From:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 py-2 rounded-lg bg-[#111] border border-[#333] text-white text-sm focus:border-primary outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400 min-w-[25px]">To:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 py-2 rounded-lg bg-[#111] border border-[#333] text-white text-sm focus:border-primary outline-none"
                  />
                </div>
              </div>
            )}

            {/* Clear Filter & Active Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Active Filters Display */}
              {(startDate || endDate || selectedDateRange) && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Active filter:</span>
                  {selectedDateRange && selectedDateRange !== 'custom' && (
                    <span className="px-2 py-1 rounded bg-primary/20 text-primary">
                      {getDateRangePresets()[selectedDateRange]?.label}
                    </span>
                  )}
                  {selectedDateRange === 'custom' && (startDate || endDate) && (
                    <div className="flex gap-1">
                      {startDate && (
                        <span className="px-2 py-1 rounded bg-primary/20 text-primary">
                          From: {formatDate(startDate)}
                        </span>
                      )}
                      {endDate && (
                        <span className="px-2 py-1 rounded bg-primary/20 text-primary">
                          To: {formatDate(endDate)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Clear Button */}
              {(startDate || endDate || selectedDateRange) && (
                <button
                  onClick={clearDateFilters}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition-colors self-start sm:self-center"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#111] rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0d0d0d] text-primary text-sm uppercase">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Registration Date</th>
                <th className="px-6 py-4">Bookings</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500 text-sm"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-[#222] hover:bg-[#1a1a1a] transition"
                  >
                    {/* User Avatar + Name */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={user.avatar_url || "https://www.citypng.com/public/uploads/preview/white-user-member-guest-icon-png-image-701751695037005zdurfaim0y.png?v=2025073005"}
                        alt={user.name.first}
                        className="w-10 h-10 rounded-full object-cover border border-primary"
                        onError={(e) => {
                          e.target.src = "https://randomuser.me/api/portraits/men/1.jpg";
                        }}
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

                    {/* Email */}
                    <td className="px-6 py-4 text-sm">
                      <div className="max-w-[200px] truncate" title={user.email}>
                        {user.email}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 capitalize">
                      <span className="px-3 py-1 rounded-full text-xs bg-[#222] border border-primary text-primary">
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {user.emailVerified ? (
                        <span className="text-green-400 font-medium text-sm">
                          Verified
                        </span>
                      ) : (
                        <span className="text-red-400 font-medium text-sm">
                          Unverified
                        </span>
                      )}
                    </td>

                    {/* Registration Date */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-white">
                          {formatDate(user.createdAt)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(user.createdAt).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </td>

                    {/* Booking Stats */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="text-primary font-bold">
                          {user.bookingStats?.total || 0}
                        </span>{" "}
                        bookings
                        {user.bookingStats?.completed > 0 && (
                          <div className="text-xs text-gray-400">
                            {user.bookingStats.completed} completed
                          </div>
                        )}
                      </div>
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

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 text-sm">
          <div className="flex items-center gap-4">
            <p className="text-gray-400">
              Showing <span className="text-primary">{currentUsers.length}</span> of{" "}
              <span className="text-primary">{filteredUsers.length}</span> users
            </p>
            <p className="text-gray-400">
              Page <span className="text-primary">{page}</span> of{" "}
              <span className="text-primary">{totalPages}</span>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className={`px-4 py-2 rounded-xl border ${page <= 1
                ? "border-[#222] text-gray-500 cursor-not-allowed"
                : "border-primary text-primary hover:bg-primary hover:text-black transition"
                }`}
            >
              Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={`px-4 py-2 rounded-xl border ${page >= totalPages
                ? "border-[#222] text-gray-500 cursor-not-allowed"
                : "border-primary text-primary hover:bg-primary hover:text-black transition"
                }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
