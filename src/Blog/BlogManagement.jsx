import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiX, FiEye, FiHeart, FiCalendar, FiClock, FiUser, FiAlertCircle, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_API_URL + '/blog'; // Use relative path to avoid CORS issues

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [expandedEditor, setExpandedEditor] = useState(false);

  // Fetch all blogs
  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}?page=${page}&limit=12`);
      
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

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Delete blog
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
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

  // Update blog
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/${editingBlog._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingBlog.title,
          category: editingBlog.category,
          author: editingBlog.author,
          reading_time: editingBlog.reading_time,
          meta_description: editingBlog.meta_description,
          meta_keywords: editingBlog.meta_keywords,
          htmlContent: editingBlog.htmlContent,
        }),
      });
      const data = await response.json();
      if (data.success) {
        showNotification('Blog updated successfully');
        setEditingBlog(null);
        setExpandedEditor(false);
        fetchBlogs(pagination.page);
      } else {
        showNotification(data.message || 'Failed to update blog', 'error');
      }
    } catch (err) {
      showNotification('Network error. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Fetch single blog for editing
  const openEditModal = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`);
      const data = await response.json();
      if (data.success) {
        setEditingBlog(data.blog);
      } else {
        showNotification('Failed to load blog details', 'error');
      }
    } catch (err) {
      showNotification('Network error. Please try again.', 'error');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pt-30 px-6 py-10 md:px-16">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-amber-500">Blog</span> Management
        </h1>
        <p className="text-gray-500">Manage all your blog posts</p>
      </header>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 px-6 py-3 rounded-lg text-white font-medium z-50 shadow-lg animate-pulse ${
            notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-4 mb-8 justify-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-8 py-5 flex flex-col items-center">
          <span className="text-3xl font-bold text-amber-500">{pagination.total}</span>
          <span className="text-sm text-gray-500 mt-1">Total Blogs</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-8 py-5 flex flex-col items-center">
          <span className="text-3xl font-bold text-amber-500">{pagination.totalPages}</span>
          <span className="text-sm text-gray-500 mt-1">Pages</span>
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
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No blogs found</p>
        </div>
      ) : (
        <>
          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.bannerImages?.[0] || blog.featured_image || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-amber-500/90 text-black text-xs font-semibold px-3 py-1 rounded-full">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2 group-hover:text-amber-500 transition-colors">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-500 text-xs mb-3 truncate">/{blog.slug}</p>

                  {/* Meta Info */}
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

                  {/* Stats */}
                  <div className="flex gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-zinc-800">
                    <span className="flex items-center gap-1">
                      <FiEye /> {blog.views || 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <FiHeart /> {blog.likes || 0} likes
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => openEditModal(blog._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black py-2 px-4 rounded-lg font-medium transition-all duration-200"
                    >
                      <FiEdit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(blog)}
                      className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2 px-4 rounded-lg font-medium transition-all duration-200"
                    >
                      <FiTrash2 size={16} />
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
                className="bg-zinc-900 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 rounded-lg font-medium transition-all"
              >
                Previous
              </button>
              <span className="text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchBlogs(pagination.page + 1)}
                className="bg-zinc-900 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 rounded-lg font-medium transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-5 border-b border-zinc-800 sticky top-0 bg-zinc-900">
              <h2 className="text-2xl font-bold text-amber-500">Edit Blog</h2>
              <button
                onClick={() => { setEditingBlog(null); setExpandedEditor(false); }}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <FiX size={28} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2 text-amber-500 text-sm font-medium">Title</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-zinc-800 rounded-lg text-white focus:border-amber-500 focus:outline-none transition-colors"
                    value={editingBlog.title || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-amber-500 text-sm font-medium">Category</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-zinc-800 rounded-lg text-white focus:border-amber-500 focus:outline-none transition-colors"
                    value={editingBlog.category || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-amber-500 text-sm font-medium">Author</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-zinc-800 rounded-lg text-white focus:border-amber-500 focus:outline-none transition-colors"
                    value={editingBlog.author || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-amber-500 text-sm font-medium">Reading Time</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-zinc-800 rounded-lg text-white focus:border-amber-500 focus:outline-none transition-colors"
                    value={editingBlog.reading_time || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, reading_time: e.target.value })}
                    placeholder="e.g., 5 min read"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-amber-500 text-sm font-medium">Meta Description</label>
                <textarea
                  className="w-full p-3 bg-black border border-zinc-800 rounded-lg text-white focus:border-amber-500 focus:outline-none transition-colors min-h-[80px] resize-y"
                  value={editingBlog.meta_description || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, meta_description: e.target.value })}
                  placeholder="SEO description for the blog"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-amber-500 text-sm font-medium">Meta Keywords</label>
                <input
                  type="text"
                  className="w-full p-3 bg-black border border-zinc-800 rounded-lg text-white focus:border-amber-500 focus:outline-none transition-colors"
                  value={editingBlog.meta_keywords || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, meta_keywords: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-amber-500 text-sm font-medium">Content (HTML)</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedEditor(!expandedEditor)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-amber-500 transition-colors px-2 py-1 border border-zinc-700 rounded"
                    >
                      {expandedEditor ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
                      {expandedEditor ? 'Collapse' : 'Expand'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedEditor('fullscreen')}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-amber-500 transition-colors px-2 py-1 border border-zinc-700 rounded"
                    >
                      <FiMaximize2 size={14} />
                      Fullscreen
                    </button>
                  </div>
                </div>
                <textarea
                  className={`w-full p-3 bg-black border border-zinc-800 rounded-lg text-white font-mono text-sm focus:border-amber-500 focus:outline-none transition-all resize-y ${
                    expandedEditor === true ? 'min-h-[500px]' : 'min-h-[200px]'
                  }`}
                  value={editingBlog.htmlContent || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, htmlContent: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => { setEditingBlog(null); setExpandedEditor(false); }}
                  className="px-6 py-3 bg-transparent border border-zinc-700 text-gray-400 hover:text-white hover:border-zinc-500 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center max-w-md">
            <div className="text-red-500 mb-4">
              <FiTrash2 size={48} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Delete Blog?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete "<span className="text-white font-medium">{showDeleteModal.title}</span>"?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-6 py-3 bg-transparent border border-zinc-700 text-gray-400 hover:text-white hover:border-zinc-500 rounded-lg font-medium transition-all"
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

      {/* Fullscreen HTML Editor Modal */}
      {expandedEditor === 'fullscreen' && editingBlog && (
        <div className="fixed inset-0 bg-black z-[60] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-900">
            <div>
              <h2 className="text-xl font-bold text-amber-500">HTML Content Editor</h2>
              <p className="text-gray-500 text-sm">{editingBlog.title}</p>
            </div>
            <button
              onClick={() => setExpandedEditor(false)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-lg font-medium transition-colors"
            >
              <FiMinimize2 size={18} />
              Exit Fullscreen
            </button>
          </div>
          
          {/* Editor */}
          <div className="flex-1 p-4">
            <textarea
              className="w-full h-full p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono text-sm focus:border-amber-500 focus:outline-none resize-none"
              value={editingBlog.htmlContent || ''}
              onChange={(e) => setEditingBlog({ ...editingBlog, htmlContent: e.target.value })}
              placeholder="Enter your HTML content here..."
            />
          </div>

          {/* Footer with stats */}
          <div className="flex justify-between items-center p-4 border-t border-zinc-800 bg-zinc-900">
            <div className="flex gap-6 text-sm text-gray-500">
              <span>Characters: {(editingBlog.htmlContent || '').length.toLocaleString()}</span>
              <span>Words: {(editingBlog.htmlContent || '').split(/\s+/).filter(Boolean).length.toLocaleString()}</span>
              <span>Lines: {(editingBlog.htmlContent || '').split('\n').length.toLocaleString()}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setExpandedEditor(false)}
                className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
              >
                Done Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
