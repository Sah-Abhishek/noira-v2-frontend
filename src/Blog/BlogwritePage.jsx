import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

export default function BlogWritePage() {
  const navigate = useNavigate();
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
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Helper functions to insert HTML tags
  const insertTag = (tag) => {
    const textarea = document.getElementById('htmlEditor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.htmlContent.substring(start, end);
    
    let newText = '';
    let cursorOffset = 0;
    
    if (tag === 'h2') {
      newText = `<h2>${selectedText || 'Heading'}</h2>`;
      cursorOffset = 4;
    } else if (tag === 'h3') {
      newText = `<h3>${selectedText || 'Subheading'}</h3>`;
      cursorOffset = 4;
    } else if (tag === 'p') {
      newText = `<p>${selectedText || 'Paragraph text here...'}</p>`;
      cursorOffset = 3;
    } else if (tag === 'strong') {
      newText = `<strong>${selectedText || 'Bold text'}</strong>`;
      cursorOffset = 8;
    } else if (tag === 'em') {
      newText = `<em>${selectedText || 'Italic text'}</em>`;
      cursorOffset = 4;
    } else if (tag === 'ul') {
      newText = `<ul>\n  <li>${selectedText || 'List item 1'}</li>\n  <li>List item 2</li>\n  <li>List item 3</li>\n</ul>`;
      cursorOffset = 11;
    } else if (tag === 'ol') {
      newText = `<ol>\n  <li>${selectedText || 'List item 1'}</li>\n  <li>List item 2</li>\n  <li>List item 3</li>\n</ol>`;
      cursorOffset = 11;
    } else if (tag === 'a') {
      newText = `<a href="https://example.com">${selectedText || 'Link text'}</a>`;
      cursorOffset = 9;
    } else if (tag === 'img') {
      newText = `<img src="image-url.jpg" alt="Description" />`;
      cursorOffset = 10;
    } else if (tag === 'blockquote') {
      newText = `<blockquote>${selectedText || 'Quote text here...'}</blockquote>`;
      cursorOffset = 12;
    } else if (tag === 'code') {
      newText = `<code>${selectedText || 'code here'}</code>`;
      cursorOffset = 6;
    }
    
    const newContent = 
      formData.htmlContent.substring(0, start) +
      newText +
      formData.htmlContent.substring(end);
    
    setFormData({ ...formData, htmlContent: newContent });
    
    // Focus back on textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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

      const response = await axios.post(
        `${apiUrl}/blog/blog-write`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Blog published:", response.data);
      alert("Blog published successfully!");
      navigate("/blog");
    } catch (error) {
      console.error("Error publishing blog:", error);
      alert("Failed to publish blog. Please try again.");
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
            {bannerImages.length > 0 && (
              <div className="mb-6">
                <img
                  src={bannerImages[0].preview}
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

            <div
              className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-img:rounded-lg prose-a:text-blue-600 prose-li:text-gray-700"
              dangerouslySetInnerHTML={{ __html: formData.htmlContent }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-30 px-6 py-10 md:px-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8">Write New Blog Post</h1>

          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Health, Wellness, Nutrition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Reading Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.reading_time}
                    onChange={(e) =>
                      setFormData({ ...formData, reading_time: e.target.value })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 5 min read"
                  />
                  <button
                    type="button"
                    onClick={calculateReadingTime}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm whitespace-nowrap"
                  >
                    Auto Calculate
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Meta Description (for SEO)
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta_description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  placeholder="Brief description for search engines (150-160 characters)"
                  maxLength="160"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {formData.meta_description.length}/160 characters
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Meta Keywords (for SEO)
                </label>
                <input
                  type="text"
                  value={formData.meta_keywords}
                  onChange={(e) =>
                    setFormData({ ...formData, meta_keywords: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>

            {/* Banner Images */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">
                Banner Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
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
                  <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload banner image
                  </span>
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
              <label className="block text-sm font-medium mb-4">
                Blog Content * (HTML)
              </label>

              {/* Toolbar */}
              <div className="bg-gray-50 border border-gray-300 rounded-t-lg p-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => insertTag('h2')}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm flex items-center gap-1"
                  title="Heading 2"
                >
                  <Heading className="w-4 h-4" />
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('h3')}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm flex items-center gap-1"
                  title="Heading 3"
                >
                  <Heading className="w-3.5 h-3.5" />
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('p')}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm flex items-center gap-1"
                  title="Paragraph"
                >
                  <Type className="w-4 h-4" />
                  P
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('strong')}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('em')}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('ul')}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('ol')}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm flex items-center gap-1"
                  title="Numbered List"
                >
                  <List className="w-4 h-4" />
                  #
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('a')}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
                  title="Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('img')}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
                  title="Image"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('blockquote')}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
                  title="Quote"
                >
                  "
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('code')}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm font-mono"
                  title="Code"
                >
                  {'</>'}
                </button>
              </div>

              {/* Editor */}
              <textarea
                id="htmlEditor"
                value={formData.htmlContent}
                onChange={(e) =>
                  setFormData({ ...formData, htmlContent: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 border-t-0 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                rows="20"
                placeholder="Write your blog content here... Use the toolbar above to add HTML tags or write HTML directly."
                required
              />

              <div className="mt-2 text-xs text-gray-500">
                <p className="font-medium mb-1">💡 Quick Tips:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Select text and click toolbar buttons to wrap in tags</li>
                  <li>Or write HTML directly for more control</li>
                  <li>Use &lt;h2&gt; for main headings, &lt;h3&gt; for subheadings</li>
                  <li>Wrap paragraphs in &lt;p&gt; tags</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsPreview(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                <Eye className="w-5 h-5" />
                Preview
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? "Publishing..." : "Publish Blog"}
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