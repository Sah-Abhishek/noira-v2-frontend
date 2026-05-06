import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import {
  Calendar,
  Clock,
  User,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  Eye,
} from "lucide-react";
import WellnessCTA from "./WellNessCTA";
import Footer from "../components/FooterSection";

export default function BlogPageArticle() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;

  useEffect(() => {
    axios
      .get(`${apiUrl}/blog/slug/${slug}`)
      .then((res) => setBlog(res.data.blog))
      .catch((err) => console.error("Error fetching blog:", err));
  }, [slug]);

  const handleLike = async () => {
    if (!liked && blog) {
      try {
        const response = await axios.post(`${apiUrl}/blog/${blog._id}/like`);
        setBlog({ ...blog, likes: response.data.likes });
        setLiked(true);
      } catch (error) {
        console.error("Error liking blog:", error);
      }
    }
  };

  const handleShare = (platform) => {
    const url = `${baseUrl}/blog/${blog.slug}`;
    const text = blog.title;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
    };

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} | Your Blog Name</title>
        <meta name="title" content={`${blog.title} | Your Blog Name`} />
        <meta name="description" content={blog.meta_description || blog.title} />
        <meta name="keywords" content={blog.meta_keywords || blog.category} />
        <meta name="author" content={blog.author} />
        <link rel="canonical" href={`${baseUrl}/blog/${blog.slug}`} />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${baseUrl}/blog/${blog.slug}`} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.meta_description || blog.title} />
        <meta property="og:image" content={blog.featured_image ? `${baseUrl}${blog.featured_image}` : `${baseUrl}/default-og-image.jpg`} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${baseUrl}/blog/${blog.slug}`} />
        <meta property="twitter:title" content={blog.title} />
        <meta property="twitter:description" content={blog.meta_description || blog.title} />
        <meta property="twitter:image" content={blog.featured_image ? `${baseUrl}${blog.featured_image}` : `${baseUrl}/default-og-image.jpg`} />

        {blog.schema_markup && (
          <script type="application/ld+json">{blog.schema_markup}</script>
        )}
      </Helmet>

      <div className="min-h-screen pt-30 bg-[#111] text-white">
        {/* Container with max-width for standard blog layout */}
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link to="/" className="hover:text-primary" itemProp="item">
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <span>/</span>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link to="/blog" className="hover:text-primary" itemProp="item">
                  <span itemProp="name">Blog</span>
                </Link>
                <meta itemProp="position" content="2" />
              </li>
              <span>/</span>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span className="text-primary" itemProp="name">{blog.title}</span>
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>

          <Link to="/blog" className="text-sm text-primary hover:underline mb-4 block">
            ← Back to Blog
          </Link>

          {/* Banner */}
          <div className="bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10">
            {blog.bannerImages && blog.bannerImages.length > 0 && (
              <img
                src={blog.bannerImages[0]}
                alt={blog.title}
                className="w-full h-72 object-cover"
                loading="eager"
              />
            )}

            <div className="p-6">
              <span className="inline-flex w-fit text-xs px-3 py-1 rounded-full bg-primary text-black font-semibold mb-3">
                {blog.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold">{blog.title}</h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-gray-400 text-sm">
                <span className="flex items-center gap-1">
                  <User size={16} /> {blog.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={16} /> <time dateTime={blog.date}>{blog.date}</time>
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} /> {blog.reading_time}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={16} /> {blog.views || 0} views
                </span>
              </div>

              {/* Meta Description */}
              {blog.meta_description && (
                <p className="text-gray-400 italic mt-3 text-sm">
                  {blog.meta_description}
                </p>
              )}

              {/* Like Button */}
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    liked
                      ? "bg-red-600/20 text-red-500 border border-red-500"
                      : "bg-white/5 hover:bg-white/10 border border-white/10"
                  }`}
                  disabled={liked}
                >
                  <Heart size={18} className={liked ? "fill-current" : ""} />
                  <span>{blog.likes || 0}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content - Render HTML with proper styling */}
          <article className="mt-6 bg-[#0d0d0d] p-6 md:p-10 rounded-2xl border border-white/10">
            <style>
              {`
                .blog-content h1 {
                  font-size: 2.25rem;
                  font-weight: 700;
                  color: #fff;
                  margin-top: 1.75rem;
                  margin-bottom: 1rem;
                  line-height: 1.2;
                }
                .blog-content h1:first-child {
                  margin-top: 0;
                }
                .blog-content h2 {
                  font-size: 1.75rem;
                  font-weight: 600;
                  background: linear-gradient(135deg, #d4a853, #c9a227, #e6c866);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  margin-top: 1.5rem;
                  margin-bottom: 0.75rem;
                  line-height: 1.3;
                }
                .blog-content h2:first-child {
                  margin-top: 0;
                }
                .blog-content h3 {
                  font-size: 1.375rem;
                  font-weight: 600;
                  color: #e5e5e5;
                  margin-top: 1.25rem;
                  margin-bottom: 0.625rem;
                  line-height: 1.4;
                }
                .blog-content h3:first-child {
                  margin-top: 0;
                }
                .blog-content h4 {
                  font-size: 1.125rem;
                  font-weight: 600;
                  color: #d4d4d4;
                  margin-top: 1.25rem;
                  margin-bottom: 0.5rem;
                  line-height: 1.4;
                }
                .blog-content h5, .blog-content h6 {
                  font-size: 1rem;
                  font-weight: 600;
                  color: #d4d4d4;
                  margin-top: 1rem;
                  margin-bottom: 0.5rem;
                }
                .blog-content p {
                  color: #d1d5db;
                  line-height: 1.8;
                  margin-bottom: 1rem;
                  font-size: 1.0625rem;
                }
                .blog-content a {
                  background: linear-gradient(135deg, #d4a853, #c9a227, #e6c866);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  text-decoration: underline;
                  text-decoration-color: #c9a227;
                  text-underline-offset: 3px;
                  text-decoration-thickness: 1px;
                  transition: all 0.2s ease;
                }
                .blog-content a:hover {
                  text-decoration-thickness: 2px;
                  text-decoration-color: #e6c866;
                }
                .blog-content strong, .blog-content b {
                  color: #fff;
                  font-weight: 600;
                }
                .blog-content ul {
                  list-style-type: disc;
                  padding-left: 1.75rem;
                  margin-top: 0.75rem;
                  margin-bottom: 1rem;
                }
                .blog-content ol {
                  list-style-type: decimal;
                  padding-left: 1.75rem;
                  margin-top: 0.75rem;
                  margin-bottom: 1rem;
                }
                .blog-content li {
                  color: #d1d5db;
                  margin-bottom: 0.375rem;
                  line-height: 1.7;
                }
                .blog-content li::marker {
                  color: #c9a227;
                }
                .blog-content img {
                  border-radius: 0.75rem;
                  margin-top: 0.75rem;
                  margin-bottom: 0.75rem;
                  max-width: 100%;
                  height: auto;
                  box-shadow: none !important;
                  display: block;
                  margin-left: auto;
                  margin-right: auto;
                  border: none !important;
                  outline: none !important;
                }
                .blog-content * img {
                  border: none !important;
                  outline: none !important;
                  box-shadow: none !important;
                }
                .blog-content [class*="image"],
                .blog-content [class*="img"],
                .blog-content [class*="figure"],
                .blog-content [class*="media"],
                .blog-content [class*="wrapper"],
                .blog-content [class*="container"] {
                  border: none !important;
                  outline: none !important;
                  box-shadow: none !important;
                  background: transparent !important;
                }
                /* Remove borders from all direct children divs and spans that might wrap images */
                .blog-content > div,
                .blog-content > span,
                .blog-content > figure,
                .blog-content > p {
                  border: none !important;
                  outline: none !important;
                }
                .blog-content div > div,
                .blog-content p > span {
                  border: none !important;
                  outline: none !important;
                }
                .blog-content blockquote {
                  border-left: 4px solid #c9a227;
                  padding-left: 1.25rem;
                  margin: 1rem 0;
                  font-style: italic;
                  color: #9ca3af;
                  background: rgba(201, 162, 39, 0.05);
                  padding: 1rem 1.25rem;
                  border-radius: 0 0.5rem 0.5rem 0;
                }
                .blog-content code {
                  background: rgba(255,255,255,0.08);
                  color: #e6c866;
                  padding: 0.2rem 0.5rem;
                  border-radius: 0.375rem;
                  font-size: 0.9em;
                  font-family: 'Fira Code', 'Monaco', monospace;
                }
                .blog-content pre {
                  background: rgba(0,0,0,0.5);
                  border: 1px solid rgba(255,255,255,0.1) !important;
                  border-radius: 0.75rem;
                  padding: 1.25rem;
                  overflow-x: auto;
                  margin: 1rem 0;
                }
                .blog-content pre code {
                  background: transparent;
                  padding: 0;
                  color: #e5e5e5;
                }
                .blog-content hr {
                  border: none !important;
                  border-top: 1px solid rgba(255,255,255,0.1) !important;
                  margin: 1.25rem 0;
                }
                .blog-content table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 1rem 0;
                }
                .blog-content th, .blog-content td {
                  border: 1px solid rgba(255,255,255,0.1) !important;
                  padding: 0.75rem 1rem;
                  text-align: left;
                }
                .blog-content th {
                  background: rgba(201, 162, 39, 0.1);
                  color: #e6c866;
                  font-weight: 600;
                }
                .blog-content td {
                  color: #d1d5db;
                }
                .blog-content figure {
                  margin: 0.75rem 0;
                  text-align: center;
                  border: none !important;
                  outline: none !important;
                  background: transparent !important;
                  box-shadow: none !important;
                }
                .blog-content figure img {
                  border: none !important;
                  outline: none !important;
                  box-shadow: none !important;
                }
                .blog-content p img {
                  border: none !important;
                  outline: none !important;
                  box-shadow: none !important;
                }
                .blog-content div img {
                  border: none !important;
                  outline: none !important;
                  box-shadow: none !important;
                }
                /* Remove all borders from wrapper elements */
                .blog-content div:not(pre):not(code),
                .blog-content span:not(code),
                .blog-content figure,
                .blog-content section,
                .blog-content aside,
                .blog-content p:not(:empty) {
                  border: none !important;
                  outline: none !important;
                  box-shadow: none !important;
                }
                /* Catch-all for any element that might have inline border styles */
                .blog-content *[style] {
                  border: none !important;
                  outline: none !important;
                }
                /* Restore left border for blockquotes */
                .blog-content blockquote {
                  border: none !important;
                  border-left: 4px solid #c9a227 !important;
                }
                .blog-content figcaption {
                  color: #9ca3af;
                  font-size: 0.875rem;
                  margin-top: 0.25rem;
                  font-style: italic;
                }
              `}
            </style>
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.htmlContent }}
            />
          </article>

          {/* Share */}
          <div className="mt-8 bg-[#0d0d0d] p-6 rounded-2xl border border-white/10">
            <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
              <Share2 size={18} /> Share this article
            </h3>
            <div className="flex gap-4 text-gray-400">
              <button
                onClick={() => handleShare("facebook")}
                className="hover:text-primary transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook size={20} />
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="hover:text-primary transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter size={20} />
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="hover:text-primary transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin size={20} />
              </button>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Visit Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-8 bg-[#0d0d0d] p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-primary mb-3">About the Author</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-black text-2xl font-bold">
                {blog.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-white text-lg">{blog.author}</p>
                <p className="text-gray-400 text-sm">
                  Expert in {blog.category} • Published {blog.date}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <WellnessCTA />
        </div>
      </div>

      <Footer />
    </>
  );
}
