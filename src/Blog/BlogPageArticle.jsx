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
  const { slug } = useParams(); // Changed from id to slug
  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;

  useEffect(() => {
    axios
      .get(`${apiUrl}/blog/slug/${slug}`) // Changed endpoint
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

      <div className="min-h-screen pt-30 bg-[#111] text-white px-6 py-10 md:px-24">
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

        {/* Content - Render HTML */}
        <article className="mt-6 bg-[#0d0d0d] p-6 md:p-8 rounded-2xl border border-white/10">
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-h1:text-3xl prose-h1:mb-4
              prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6 prose-h2:text-primary
              prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4
              prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-semibold
              prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
              prose-li:text-gray-300 prose-li:mb-2
              prose-img:rounded-lg prose-img:shadow-lg prose-img:my-6
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-400
              prose-code:bg-white/5 prose-code:text-primary prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
              prose-pre:bg-black/50 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:border prose-pre:border-white/10"
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

      <Footer />
    </>
  );
}