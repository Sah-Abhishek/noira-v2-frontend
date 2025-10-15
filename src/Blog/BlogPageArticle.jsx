import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Calendar, Clock, User, Share2, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import WellnessCTA from "./WellNessCTA";
import Footer from "../components/FooterSection";

export default function BlogPageArticle() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/blog/${id}`)
      .then((res) => setBlog(res.data.blog))
      .catch((err) => console.error("Error fetching blog:", err));
  }, [id]);

  if (!blog) return <div className="text-white p-10">Loading...</div>;

  return (
    <div>    <div className="min-h-screen pt-30 bg-[#111] text-white px-6 py-10 md:px-24">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-4 flex items-center gap-1">
        <Link to="/" className="hover:text-primary">Home</Link> /
        <Link to="/blog" className="hover:text-primary">Blog</Link> /
        <span className="text-primary">{blog.title}</span>
      </div>

      <Link to="/blog" className="text-sm text-primary hover:underline mb-4 block">
        ← Back to Blog
      </Link>

      {/* Banner */}
      <div className="bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10">
        <img
          src={blog.banner_image}
          alt={blog.title}
          className="w-full h-72 object-cover"
        />
        <div className="p-6">
          <span className="inline-flex w-fit text-xs px-3 py-1 rounded-full bg-primary text-black font-semibold mb-3">
            {blog.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold">{blog.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-gray-400 text-sm">
            {/* <span className="flex items-center gap-1"> */}
            {/*   <User size={16} /> {blog.author} */}
            {/* </span> */}
            <span className="flex items-center gap-1">
              <Calendar size={16} /> {blog.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} /> {blog.reading_time}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 space-y-6 bg-[#0d0d0d] p-6 rounded-2xl border border-white/10">
        {blog.content?.map((section, index) => (
          <div key={index}>
            {section.section && (
              <h2 className="text-xl font-semibold text-primary mb-2">
                {section.section}
              </h2>
            )}
            {section.text && <p className="text-gray-300">{section.text}</p>}
            {section.list && (
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {section.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Share */}
      <div className="mt-8 bg-[#0d0d0d] p-6 rounded-2xl border border-white/10">
        <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
          <Share2 size={18} /> Share this article
        </h3>
        <div className="flex gap-4 text-gray-400">
          <a href="www.facebook.com" className="hover:text-primary"><Facebook size={20} /></a>
          <a href="www.x.com" className="hover:text-primary"><Twitter size={20} /></a>
          <a href="www.instagram.com " className="hover:text-primary"><Instagram size={20} /></a>
          <a href="www.linkedin.com" className="hover:text-primary"><Linkedin size={20} /></a>
        </div>
      </div>

      {/* CTA */}
      <WellnessCTA />
    </div>
      <Footer />
    </div>

  );
}
