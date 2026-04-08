import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiHeart,
  FiCalendar,
  FiClock,
  FiUser,
  FiAlertCircle,
  FiPlus,
  FiEyeOff,
} from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_API_URL + '/blog';

export default function BlogManagement() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [notification, setNotification] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [togglingId, setTogglingId] = useState(null);

  // Fetch all blogs (including unpublished — admin view)
  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}?page=${page}&limit=12&all=true`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setBlogs(data.blogs);
        setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to fetch blogs');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to fetch blogs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Delete blog
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        showNotification('Blog deleted successfully');
        fetchBlogs(pagination.page);
      } else {
        showNotification(data.message || 'Failed to delete blog', 'error');
      }
    } catch (err) {
      showNotification('Network error. Please try again.', 'error');
    }
    setShowDeleteModal(null);
  };

  // Toggle list/delist (published)
  const handleTogglePublish = async (blog) => {
    setTogglingId(blog._id);
    try {
      const response = await fetch(`${API_BASE}/${blog._id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !blog.published }),
      });
      const data = await response.json();
      if (data.success) {
        showNotification(data.message);
        // Optimistically update local state so the badge flips immediately.
        setBlogs((prev) =>
          prev.map((b) => (b._id === blog._id ? { ...b, published: data.published } : b))
        );
      } else {
        showNotification(data.message || 'Failed to update blog', 'error');
      }
    } catch (err) {
      showNotification('Network error. Please try again.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#111] text-white p-6 md:p-8">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="text-amber-500">Content</span> Management
          </h1>
          <p className="text-gray-500 mt-1">Write, edit, delist or delete blog posts</p>
        </div>
        <button
          onClick={() => navigate('/admin/contentmanagement/write')}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-5 py-3 rounded-lg font-semibold transition-colors self-start md:self-auto"
        >
          <FiPlus size={18} />
          Write New Blog
        </button>
      </header>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 px-6 py-3 rounded-lg text-white font-medium z-50 shadow-lg ${
            notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:flex gap-4 mb-8">
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl px-6 py-4 flex flex-col items-center md:items-start">
          <span className="text-2xl md:text-3xl font-bold text-amber-500">{pagination.total}</span>
          <span className="text-xs md:text-sm text-gray-500 mt-1">Total Blogs</span>
        </div>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl px-6 py-4 flex flex-col items-center md:items-start">
          <span className="text-2xl md:text-3xl font-bold text-amber-500">
            {blogs.filter((b) => b.published).length}
          </span>
          <span className="text-xs md:text-sm text-gray-500 mt-1">Listed</span>
        </div>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl px-6 py-4 flex flex-col items-center md:items-start">
          <span className="text-2xl md:text-3xl font-bold text-amber-500">
            {blogs.filter((b) => !b.published).length}
          </span>
          <span className="text-xs md:text-sm text-gray-500 mt-1">Delisted</span>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-zinc-700 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading blogs...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <FiAlertCircle className="mx-auto text-red-500 text-5xl mb-4" />
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => fetchBlogs()}
            className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 bg-[#0d0d0d] border border-white/10 rounded-xl">
          <p className="text-gray-500 text-lg mb-4">No blogs yet</p>
          <button
            onClick={() => navigate('/admin/contentmanagement/write')}
            className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Write your first blog
          </button>
        </div>
      ) : (
        <>
          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 group flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      blog.bannerImages?.[0] ||
                      blog.featured_image ||
                      'https://via.placeholder.com/400x200?text=No+Image'
                    }
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-amber-500/90 text-black text-xs font-semibold px-3 py-1 rounded-full">
                      {blog.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        blog.published
                          ? 'bg-green-500/90 text-black'
                          : 'bg-zinc-700/90 text-gray-300'
                      }`}
                    >
                      {blog.published ? 'Listed' : 'Delisted'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2 group-hover:text-amber-500 transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-gray-500 text-xs mb-3 truncate">/{blog.slug}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <FiUser className="text-amber-500" />
                      {blog.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar className="text-amber-500" />
                      {formatDate(blog.date || blog.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="text-amber-500" />
                      {blog.reading_time || '5 min'}
                    </span>
                  </div>

                  <div className="flex gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-white/10">
                    <span className="flex items-center gap-1">
                      <FiEye /> {blog.views || 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <FiHeart /> {blog.likes || 0} likes
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate(`/admin/contentmanagement/edit/${blog._id}`)}
                      className="flex items-center justify-center gap-2 bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black py-2 px-3 rounded-lg font-medium transition-all duration-200 text-sm"
                    >
                      <FiEdit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleTogglePublish(blog)}
                      disabled={togglingId === blog._id}
                      className={`flex items-center justify-center gap-2 border py-2 px-3 rounded-lg font-medium transition-all duration-200 text-sm disabled:opacity-50 ${
                        blog.published
                          ? 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black'
                          : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black'
                      }`}
                    >
                      <FiEyeOff size={14} />
                      {blog.published ? 'Delist' : 'List'}
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(blog)}
                      className="col-span-2 flex items-center justify-center gap-2 bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2 px-3 rounded-lg font-medium transition-all duration-200 text-sm"
                    >
                      <FiTrash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                disabled={pagination.page === 1}
                onClick={() => fetchBlogs(pagination.page - 1)}
                className="bg-[#0d0d0d] border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 rounded-lg font-medium transition-all"
              >
                Previous
              </button>
              <span className="text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchBlogs(pagination.page + 1)}
                className="bg-[#0d0d0d] border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 rounded-lg font-medium transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-8 text-center max-w-md">
            <div className="text-red-500 mb-4">
              <FiTrash2 size={48} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Delete Blog?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete "
              <span className="text-white font-medium">{showDeleteModal.title}</span>"? This action
              cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-6 py-3 bg-transparent border border-white/20 text-gray-400 hover:text-white hover:border-white/40 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal._id)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
