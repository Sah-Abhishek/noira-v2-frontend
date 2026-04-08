import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Save,
  Eye,
  X,
  Image as ImageIcon,
  Type,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Heading,
  ArrowLeft,
} from "lucide-react";

export default function BlogWritePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const apiUrl = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    author: "",
    date: new Date().toISOString().split("T")[0],
    reading_time: "",
    meta_description: "",
    meta_keywords: "",
    htmlContent: "",
  });

  const [bannerImages, setBannerImages] = useState([]);
  const [existingBannerImages, setExistingBannerImages] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(false);

  // Load existing blog when editing
  useEffect(() => {
    if (!isEditMode) return;

    const loadBlog = async () => {
      setLoadingBlog(true);
      try {
        const res = await axios.get(`${apiUrl}/blog/${id}`);
        if (res.data?.success) {
          const b = res.data.blog;
          setFormData({
            title: b.title || "",
            category: b.category || "",
            author: b.author || "",
            // backend stores `date` as a string — fall back to today if missing
            date: b.date || new Date().toISOString().split("T")[0],
            reading_time: b.reading_time || "",
            meta_description: b.meta_description || "",
            meta_keywords: b.meta_keywords || "",
            htmlContent: b.htmlContent || "",
          });
          setExistingBannerImages(b.bannerImages || []);
        }
      } catch (err) {
        console.error("Failed to load blog:", err);
        alert("Failed to load blog for editing.");
      } finally {
        setLoadingBlog(false);
      }
    };

    loadBlog();
  }, [id, isEditMode, apiUrl]);

  const handleBannerImagesUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setBannerImages([...bannerImages, ...newImages]);
  };

  const removeBannerImage = (index) => {
    const newImages = bannerImages.filter((_, idx) => idx !== index);
    setBannerImages(newImages);
  };

  const calculateReadingTime = () => {
    const wordsPerMinute = 200;
    const textContent = formData.htmlContent.replace(/<[^>]*>/g, "");
    const wordCount = textContent.split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    setFormData({
      ...formData,
      reading_time: `${minutes} min read`,
    });
  };

  const insertTag = (tag) => {
    const textarea = document.getElementById("htmlEditor");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.htmlContent.substring(start, end);

    let newText = "";
    let cursorOffset = 0;

    if (tag === "h2") {
      newText = `<h2>${selectedText || "Heading"}</h2>`;
      cursorOffset = 4;
    } else if (tag === "h3") {
      newText = `<h3>${selectedText || "Subheading"}</h3>`;
      cursorOffset = 4;
    } else if (tag === "p") {
      newText = `<p>${selectedText || "Paragraph text here..."}</p>`;
      cursorOffset = 3;
    } else if (tag === "strong") {
      newText = `<strong>${selectedText || "Bold text"}</strong>`;
      cursorOffset = 8;
    } else if (tag === "em") {
      newText = `<em>${selectedText || "Italic text"}</em>`;
      cursorOffset = 4;
    } else if (tag === "ul") {
      newText = `<ul>\n  <li>${selectedText || "List item 1"}</li>\n  <li>List item 2</li>\n  <li>List item 3</li>\n</ul>`;
      cursorOffset = 11;
    } else if (tag === "ol") {
      newText = `<ol>\n  <li>${selectedText || "List item 1"}</li>\n  <li>List item 2</li>\n  <li>List item 3</li>\n</ol>`;
      cursorOffset = 11;
    } else if (tag === "a") {
      newText = `<a href="https://example.com">${selectedText || "Link text"}</a>`;
      cursorOffset = 9;
    } else if (tag === "img") {
      newText = `<img src="image-url.jpg" alt="Description" />`;
      cursorOffset = 10;
    } else if (tag === "blockquote") {
      newText = `<blockquote>${selectedText || "Quote text here..."}</blockquote>`;
      cursorOffset = 12;
    } else if (tag === "code") {
      newText = `<code>${selectedText || "code here"}</code>`;
      cursorOffset = 6;
    }

    const newContent =
      formData.htmlContent.substring(0, start) +
      newText +
      formData.htmlContent.substring(end);

    setFormData({ ...formData, htmlContent: newContent });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        // PUT — backend currently consumes JSON for update; new images appended via multipart only when present.
        // Use multipart/form-data so newly added banner images are attached as files.
        const submitData = new FormData();
        submitData.append("title", formData.title);
        submitData.append("category", formData.category);
        submitData.append("author", formData.author);
        submitData.append("date", formData.date);
        submitData.append("reading_time", formData.reading_time);
        submitData.append("meta_description", formData.meta_description);
        submitData.append("meta_keywords", formData.meta_keywords);
        submitData.append("htmlContent", formData.htmlContent);

        bannerImages.forEach((img) => {
          submitData.append("bannerImages", img.file);
        });

        await axios.put(`${apiUrl}/blog/${id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("Blog updated successfully!");
      } else {
        const submitData = new FormData();
        submitData.append("title", formData.title);
        submitData.append("category", formData.category);
        submitData.append("author", formData.author);
        submitData.append("date", formData.date);
        submitData.append("reading_time", formData.reading_time);
        submitData.append("meta_description", formData.meta_description);
        submitData.append("meta_keywords", formData.meta_keywords);
        submitData.append("htmlContent", formData.htmlContent);

        bannerImages.forEach((img) => {
          submitData.append("bannerImages", img.file);
        });

        await axios.post(`${apiUrl}/blog/blog-write`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("Blog published successfully!");
      }

      navigate("/admin/contentmanagement");
    } catch (error) {
      console.error("Error saving blog:", error);
      alert(`Failed to ${isEditMode ? "update" : "publish"} blog. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const PreviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold">Preview</h2>
            <button
              onClick={() => setIsPreview(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {(bannerImages.length > 0 || existingBannerImages.length > 0) && (
              <div className="mb-6">
                <img
                  src={bannerImages[0]?.preview || existingBannerImages[0]}
                  alt="Banner"
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mb-4">
                {formData.category}
              </span>
              <h1 className="text-4xl font-bold mb-4">{formData.title}</h1>
              <div className="flex gap-4 text-gray-600 text-sm mb-4">
                <span>{formData.author}</span>
                <span>•</span>
                <span>{formData.date}</span>
                <span>•</span>
                <span>{formData.reading_time}</span>
              </div>
              {formData.meta_description && (
                <p className="text-gray-600 italic">{formData.meta_description}</p>
              )}
            </div>

            <style>
              {`
                .blog-content h1 { font-size: 2.25rem; font-weight: 700; margin: 1.5rem 0 1rem; }
                .blog-content h2 { font-size: 1.875rem; font-weight: 700; margin: 1.5rem 0 1rem; }
                .blog-content h3 { font-size: 1.5rem; font-weight: 600; margin: 1.25rem 0 0.75rem; }
                .blog-content h4 { font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem; }
                .blog-content p { margin: 1rem 0; line-height: 1.75; color: #374151; }
                .blog-content a { color: #2563eb; text-decoration: underline; }
                .blog-content a:hover { color: #1d4ed8; }
                .blog-content ul, .blog-content ol { margin: 1rem 0; padding-left: 1.5rem; }
                .blog-content ul { list-style-type: disc; }
                .blog-content ol { list-style-type: decimal; }
                .blog-content li { margin: 0.5rem 0; color: #374151; }
                .blog-content blockquote { border-left: 4px solid #e5e7eb; padding-left: 1rem; margin: 1rem 0; font-style: italic; color: #6b7280; }
                .blog-content code { background: #f3f4f6; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875rem; }
                .blog-content img { max-width: 100%; border-radius: 0.5rem; margin: 1rem 0; }
              `}
            </style>

            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: formData.htmlContent }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (loadingBlog) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-zinc-700 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">Loading blog...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate("/admin/contentmanagement")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Content
          </button>
        </div>

        <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">
            <span className="text-amber-500">{isEditMode ? "Edit" : "Write New"}</span> Blog Post
          </h1>

          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-amber-500">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#111] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-amber-500">Category *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#111] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="e.g., Health, Wellness, Nutrition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-amber-500">Author *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#111] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-amber-500">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#111] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-amber-500">Reading Time</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.reading_time}
                    onChange={(e) => setFormData({ ...formData, reading_time: e.target.value })}
                    className="flex-1 px-4 py-2.5 bg-[#111] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="e.g., 5 min read"
                  />
                  <button
                    type="button"
                    onClick={calculateReadingTime}
                    className="px-4 py-2.5 bg-[#111] border border-white/10 hover:border-amber-500 hover:text-amber-500 rounded-lg text-sm whitespace-nowrap transition-colors"
                  >
                    Auto Calculate
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-amber-500">
                  Meta Description (for SEO)
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData({ ...formData, meta_description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-[#111] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  rows="2"
                  placeholder="Brief description for search engines (150-160 characters)"
                  maxLength="160"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {formData.meta_description.length}/160 characters
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-amber-500">
                  Meta Keywords (for SEO)
                </label>
                <input
                  type="text"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#111] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>

            {/* Existing Banner Images (edit mode only) */}
            {isEditMode && existingBannerImages.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-amber-500">
                  Current Banner Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingBannerImages.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Existing banner ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-white/10"
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  New uploads below will be appended to this list.
                </p>
              </div>
            )}

            {/* Banner Images Upload */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2 text-amber-500">
                {isEditMode ? "Add New Banner Image(s)" : "Banner Image"}
              </label>
              <div className="border-2 border-dashed border-white/10 rounded-lg p-6 hover:border-amber-500/50 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleBannerImagesUpload}
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <ImageIcon className="w-12 h-12 text-gray-500 mb-2" />
                  <span className="text-sm text-gray-400">Click to upload banner image</span>
                </label>

                {bannerImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {bannerImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img.preview}
                          alt={`Banner ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeBannerImage(idx)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* HTML Content Editor */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-4 text-amber-500">
                Blog Content * (HTML)
              </label>

              {/* Toolbar */}
              <div className="bg-[#111] border border-white/10 rounded-t-lg p-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => insertTag("h2")}
                  className="px-3 py-1.5 bg-[#0d0d0d] border border-white/10 rounded hover:border-amber-500 hover:text-amber-500 text-sm flex items-center gap-1 transition-colors"
                  title="Heading 2"
                >
                  <Heading className="w-4 h-4" />
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => insertTag("h3")}
                  className="px-3 py-1.5 bg-[#0d0d0d] border border-white/10 rounded hover:border-amber-500 hover:text-amber-500 text-sm flex items-center gap-1 transition-colors"
                  title="Heading 3"
                >
                  <Heading className="w-3.5 h-3.5" />
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => insertTag("p")}
                  className="px-3 py-1.5 bg-[#0d0d0d] border border-white/10 rounded hover:border-amber-500 hover:text-amber-500 text-sm flex items-center gap-1 transition-colors"
                  title="Paragraph"
                >
                  <Type className="w-4 h-4" />
                  P
                </button>
                <button
                  type="button"
                  onClick={() => insertTag("strong")}
                  className="px-3 py-1.5 bg-[#0d0d0d] border border-white/10 rounded hover:border-amber-500 hover:text-amber-500 text-sm transition-colors"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTag("em")}
                  className="px-3 py-1.5 bg-[#0d0d0d] border border-white/10 rounded hover:border-amber-500 hover:text-amber-500 text-sm transition-colors"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTag("ul")}
                  className="px-3 py-1.5 bg-[#0d0d0d] border border-white/10 rounded hover:border-amber-500 hover:text-amber-500 text-sm transition-colors"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTag("ol")}
                  className="px-3 py-1.5 bg-[#0d0d0d] border border-white/10 rounded hover:border-amber-500 hover:text-amber-500 text-sm flex items-center gap-1 transition-colors"
                  title="Numbered List"
                >
                  <List className="w-4 h-4" />#
                </button>
                <button
                  type="button"
                  onClick={() => insertTag("a")}
                  className="px-3 py-1.5 bg-[#0d0d0d] border border-white/10 rounded hover:border-amber-500 hover:text-amber-500 text-sm transition-colors"
                  title="Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTag("img")}
                  className="px-3 py-1.5 bg-[#0d0d0d] border border-white/10 rounded hover:border-amber-500 hover:text-amber-500 text-sm transition-colors"
                  title="Image"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTag("blockquote")}
                  className="px-3 py-1.5 bg-[#0d0d0d] border border-white/10 rounded hover:border-amber-500 hover:text-amber-500 text-sm transition-colors"
                  title="Quote"
                >
                  "
                </button>
                <button
                  type="button"
                  onClick={() => insertTag("code")}
                  className="px-3 py-1.5 bg-[#0d0d0d] border border-white/10 rounded hover:border-amber-500 hover:text-amber-500 text-sm font-mono transition-colors"
                  title="Code"
                >
                  {"</>"}
                </button>
              </div>

              {/* Editor */}
              <textarea
                id="htmlEditor"
                value={formData.htmlContent}
                onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                className="w-full px-4 py-3 bg-[#111] border border-white/10 border-t-0 rounded-b-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm outline-none"
                rows="20"
                placeholder="Write your blog content here... Use the toolbar above to add HTML tags or write HTML directly."
                required
              />

              <div className="mt-2 text-xs text-gray-500">
                <p className="font-medium mb-1">Quick Tips:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Select text and click toolbar buttons to wrap in tags</li>
                  <li>Or write HTML directly for more control</li>
                  <li>Use &lt;h2&gt; for main headings, &lt;h3&gt; for subheadings</li>
                  <li>Wrap paragraphs in &lt;p&gt; tags</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => setIsPreview(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#111] border border-white/10 hover:border-amber-500 hover:text-amber-500 rounded-lg font-medium transition-colors"
              >
                <Eye className="w-5 h-5" />
                Preview
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-5 h-5" />
                {isSubmitting
                  ? isEditMode
                    ? "Saving..."
                    : "Publishing..."
                  : isEditMode
                  ? "Save Changes"
                  : "Publish Blog"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreview && <PreviewModal />}
    </div>
  );
}
