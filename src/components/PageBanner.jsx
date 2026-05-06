import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Displays active banners for a specific page and position.
 *
 * Usage:
 *   <PageBanner page="home" position="top" />
 *
 * Props:
 *   page     - page identifier (home, services, all-services, about, blog, booking, careers, browse-therapists)
 *   position - where on the page (top, middle, bottom) — defaults to "top"
 */
export default function PageBanner({ page, position = "top" }) {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${apiUrl}/banners/active`, {
          params: { page },
        });
        const filtered = res.data.banners.filter(
          (b) => b.position === position
        );
        setBanners(filtered);
      } catch {
        // silently fail — banners are non-critical
      }
    };
    fetchBanners();
  }, [page, position, apiUrl]);

  // Auto-rotate if multiple banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (dismissed || banners.length === 0) return null;

  const banner = banners[currentIndex];

  const handleClick = () => {
    if (!banner.linkUrl) return;
    if (banner.linkUrl.startsWith("http")) {
      window.open(banner.linkUrl, "_blank", "noopener,noreferrer");
    } else {
      navigate(banner.linkUrl);
    }
  };

  const prev = () =>
    setCurrentIndex(
      (i) => (i - 1 + banners.length) % banners.length
    );
  const next = () =>
    setCurrentIndex((i) => (i + 1) % banners.length);

  return (
    <div className="relative w-full overflow-hidden group">
      {/* Banner Image */}
      <div
        onClick={handleClick}
        className={banner.linkUrl ? "cursor-pointer" : ""}
      >
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className="w-full h-auto object-cover max-h-[400px]"
        />
      </div>

      {/* Dismiss Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setDismissed(true);
        }}
        className="absolute top-3 right-3 p-1.5 bg-black/50 rounded-full text-white/80 hover:bg-black/70 transition opacity-0 group-hover:opacity-100"
      >
        <X size={16} />
      </button>

      {/* Navigation Arrows (multi-banner) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(i);
                }}
                className={`w-2 h-2 rounded-full transition ${
                  i === currentIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
