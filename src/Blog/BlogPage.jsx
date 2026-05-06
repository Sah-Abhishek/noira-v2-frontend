import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Calendar, Clock, User, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/FooterSection";
import PageBanner from "../components/PageBanner";
import { Helmet } from "react-helmet-async";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/blog/`)
      .then((res) => setBlogs(res.data.blogs || []))
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  const categories = ["All", "Massage", "Wellness", "Lifestyle"];

  // Helper function to extract plain text from HTML
  const extractTextFromHTML = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  // Helper function to get excerpt from HTML content
  const getExcerpt = (html, maxLength = 150) => {
    const text = extractTextFromHTML(html);
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;
    
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.meta_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      extractTextFromHTML(blog.htmlContent || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <Helmet>
        <title>
          Wellness & Luxury Blog | Expert Massage, Wellness & Lifestyle Tips | Noira
        </title>
        <meta
          name="description"
          content="Explore Noira's Wellness & Luxury Blog for expert tips on massage therapy, relaxation, and luxury wellness in London. Discover how to elevate your lifestyle through holistic care and premium treatments."
        />
        <meta
          name="keywords"
          content="massage tips, wellness blog, luxury spa, London wellness, at-home massage, self-care, lifestyle articles, relaxation techniques"
        />
        <meta property="og:title" content="Noira Wellness & Luxury Blog" />
        <meta
          property="og:description"
          content="Luxury wellness insights from London's top mobile massage experts. Read about relaxation, body care, and wellness practices that transform your lifestyle."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://noira.co.uk/blog" />
        <meta property="og:image" content="https://noira.co.uk/og-blog.jpg" />
        
        {/* Structured Data for Blog List */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Noira Wellness & Luxury Blog",
            "description": "Expert insights on massage therapy, wellness, and luxury lifestyle",
            "url": "https://noira.co.uk/blog"
          })}
        </script>
      </Helmet>

      <PageBanner page="blog" position="top" />
      <div className="min-h-screen pt-30 bg-black text-white px-6 py-10 md:px-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="cursor-pointer hover:text-primary">Home</Link>{" "}
          / <span className="text-primary">Blog</span>
        </nav>

        {/* Header */}
        <div className="flex justify-center items-center flex-col">
          <h1 className="text-4xl md:text-5xl font-bold text-primary pb-10">
            Wellness & Luxury Blog
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl text-center pb-10">
            Discover the art of wellness through expert insights, luxury treatments,
            and transformative experiences in the heart of London.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mt-10">
          {/* Blog Cards */}
          <div className="md:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {filteredBlogs.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-10">
                No blogs found. Try a different search or category.
              </div>
            ) : (
              filteredBlogs.map((blog) => (
                <article
                  key={blog._id}
                  className="bg-[#0d0d0d] rounded-2xl overflow-hidden shadow-lg border border-white/10 hover:border-primary/30 transition-colors"
                >
                  {/* Banner Image */}
                  {blog.bannerImages && blog.bannerImages.length > 0 && (
                    <img
                      src={blog.bannerImages[0]}
                      alt={blog.title}
                      className="h-44 w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  
                  <div className="p-4">
                    <span className="inline-block w-fit text-xs px-3 py-1 rounded-full bg-primary text-black font-semibold mb-3">
                      {blog.category}
                    </span>
                    
                    <h2 className="text-lg font-semibold leading-tight line-clamp-2">
                      {blog.title}
                    </h2>
                    
                    {/* Meta Description or HTML excerpt */}
                    <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                      {blog.meta_description || getExcerpt(blog.htmlContent)}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-gray-500 text-xs">
                      <span className="flex items-center gap-1">
                        <User size={14} /> {blog.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {blog.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {blog.reading_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} /> {blog.views || 0}
                      </span>
                    </div>

                    <Link
                      to={`/blog/${blog.slug}`}
                      className="mt-4 inline-flex text-primary font-medium items-center gap-2 hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Search */}
            <div className="bg-[#0d0d0d] rounded-2xl p-5 border border-white/10">
              <h2 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <Search size={18} /> Search Articles
              </h2>
              <input
                type="text"
                placeholder="Search wellness topics..."
                className="w-full bg-transparent border border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search articles"
              />
            </div>

            {/* Categories */}
            <div className="bg-[#0d0d0d] rounded-2xl p-5 border border-white/10">
              <h2 className="font-semibold text-primary mb-3">Categories</h2>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat
                          ? "bg-primary text-black font-medium"
                          : "hover:bg-[#111]"
                      }`}
                      aria-pressed={selectedCategory === cat}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            <div className="bg-[#0d0d0d] rounded-2xl p-5 border border-white/10">
              <h2 className="font-semibold text-primary mb-3">Recent Posts</h2>
              <ul className="space-y-4">
                {blogs.slice(0, 3).map((post) => (
                  <li key={post._id}>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="flex items-start gap-3 hover:opacity-80 transition-opacity"
                    >
                      {post.bannerImages && post.bannerImages.length > 0 && (
                        <img
                          src={post.bannerImages[0]}
                          alt={post.title}
                          className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                          loading="lazy"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">
                          {post.title}
                        </p>
                        <span className="text-xs text-gray-400">{post.date}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Tags (Optional) */}
            <div className="bg-[#0d0d0d] rounded-2xl p-5 border border-white/10">
              <h2 className="font-semibold text-primary mb-3">Popular Tags</h2>
              <div className="flex flex-wrap gap-2">
                {["Massage", "Wellness", "Relaxation", "Self-Care", "London"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}