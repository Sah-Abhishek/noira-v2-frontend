import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Globe2,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useBookingStore from "../../store/bookingStore";
import FancyDropdown from "./FancyDropdown";
import { User } from 'lucide-react';
import useUserStore from "../../store/UserStore";
import PostalCodeModal from "../PostalCodeModal";
import toast from "react-hot-toast";

/** Helpers */
const fullName = (t) =>
  `${t?.userId?.name?.first ?? ""} ${t?.userId?.name?.last ?? ""}`.trim();

const FILTERS_DEFAULT = {
  service: "All Services",
  language: "All Languages",
  gender: "No Preference",
};

const LIMIT = 6;

export default function BrowseTherapists() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(FILTERS_DEFAULT);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { setSelectedTherapist } = useBookingStore();
  const userjwt = localStorage.getItem("userjwt");
  const isPostalCodeSaved = sessionStorage.getItem("postalCode") ? true : false;
  const { user } = useUserStore();
  const [isPostalCodeModalOpen, setIsPostalCodeModalOpen] = useState(!isPostalCodeSaved);
  const postalCode = sessionStorage.getItem("postalCode") || user?.address?.PostalCode;
  const [noTherapistToastShown, setNoTherapistToastShown] = useState(false);






  const gridRef = useRef(null);

  const fetchTherapists = async (pageNum) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${apiUrl}/therapist/getalltherapists`, {
        params: { page: pageNum, limit: LIMIT, postalCode },
        headers: {
          Authorization: `Bearer ${userjwt}`,
        },
      });
      console.log("This is the length: ", res?.data);
      const therapistsList = res.data?.therapists ?? [];

      if (therapistsList.length === 0 && !noTherapistToastShown) {
        toast.error("No therapist found");
        setNoTherapistToastShown(true);
      }
      setTherapists(res.data?.therapists ?? []);
      setTotalPages(res.data?.totalPages ?? 1);

      requestAnimationFrame(() => {
        gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (e) {
      setError(
        e?.response?.data?.message || e.message || "Failed to load therapists"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapists(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  /** Filter options */
  const serviceOptions = useMemo(() => {
    const set = new Set();
    therapists.forEach((t) =>
      (t?.profile?.specializations ?? []).forEach((s) => set.add(s))
    );
    return ["All Services", ...Array.from(set)];
  }, [therapists]);

  const languageOptions = useMemo(() => {
    const set = new Set();
    therapists.forEach((t) => (t?.profile?.languages ?? []).forEach((l) => set.add(l)));
    return ["All Languages", ...Array.from(set)];
  }, [therapists]);

  /** Client-side filtering */
  const filtered = useMemo(() => {
    return therapists.filter((t) => {
      const okService =
        filters.service === "All Services" ||
        (t?.specializations ?? []).some((s) => s.name === filters.service);

      const okLanguage =
        filters.language === "All Languages" ||
        (t?.languages ?? []).includes(filters.language);

      const okGender =
        filters.gender === "No Preference" ||
        (t?.userId?.gender ?? "").toLowerCase() ===
        filters.gender.toLowerCase();

      return okService && okLanguage && okGender;
    });
  }, [therapists, filters]);

  const onResetFilters = () => setFilters(FILTERS_DEFAULT);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mt-10 tracking-tight">
          Choose Your <span className="text-primary">Therapist</span>
        </h1>
        <p className="text-gray-300 mt-2">
          Select from our certified wellness professionals
        </p>
        <p className="text-primary mt-1 text-sm">
          Selected Service: Massage Therapy
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-4 md:p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-center text-gray-200 mb-4">
            Filter Therapists
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Services */}
            <FancyDropdown
              label="Service"
              options={serviceOptions}
              value={filters.service}
              onChange={(val) => setFilters((f) => ({ ...f, service: val }))}
            />

            {/* Language */}
            <FancyDropdown
              label="Language"
              options={languageOptions}
              value={filters.language}
              onChange={(val) => setFilters((f) => ({ ...f, language: val }))}
            />
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={onResetFilters}
              className="text-sm px-4 py-2 rounded-full border border-white/10 hover:border-white/30 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div ref={gridRef} className="max-w-6xl mx-auto px-4 mt-8">
        {error && (
          <div className="bg-red-900/30 border border-red-700/40 text-red-200 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(LIMIT)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[#0d0d0d] border border-white/10 p-5 animate-pulse"
              >
                <div className="h-20 w-20 rounded-full bg-white/10 mb-4" />
                <div className="h-4 w-1/2 bg-white/10 mb-2 rounded" />
                <div className="h-3 w-1/3 bg-white/10 mb-4 rounded" />
                <div className="h-8 w-full bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <TherapistCard key={t._id} t={t} />
            ))}
            {!filtered.length && (
              <div className="col-span-full text-center text-gray-400 py-12">
                No therapists match the selected filters.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="max-w-6xl mx-auto px-4 mt-10 pb-16">
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={(p) => setPage(p)}
        />
      </div>
      {!user?.address &&
        <PostalCodeModal isOpen={isPostalCodeModalOpen} onClose={() => setIsPostalCodeModalOpen(false)} />
      }

    </div>
  );
}

/** Therapist Card */
function TherapistCard({ t }) {
  const verified = t?.profile?.isVerified;
  const rawRating = t?.profile?.rating ?? 0;
  const rating =
    rawRating === 0 ? (Math.random() * (5 - 4) + 4).toFixed(1) : rawRating.toFixed(1);
  const ratingCount = t?.profile?.ratingCount ?? 0;
  const tags = (t?.profile?.specializations ?? []).slice(0, 4);
  const languages = t?.profile?.languages ?? [];
  const exp = t?.profile?.experience;
  const bio = t?.profile?.bio || "";
  // console.log("This is the bio: ", bio);

  const navigate = useNavigate();
  const { setSelectedTherapist } = useBookingStore();
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ modal state


  const handleSelectTherapist = () => {
    setSelectedTherapist(t?.profile);
    navigate("/servicesbytherapist");
  };

  return (
    <>
      <div className="rounded-3xl bg-[#0d0d0d] border border-white/10 shadow-lg p-6 relative">
        {verified && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-emerald-400 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Verified
          </span>
        )}

        <div className="flex items-center gap-4">
          <img
            src={t?.avatar_url}
            alt={`${t?.name?.first ?? ""} ${t?.name?.last ?? ""}`}
            className="h-20 w-20 rounded-full object-cover ring-2 ring-primary/50"
            onClick={() => setIsModalOpen(true)}
          />
          <div>
            <h1 className="text-lg font-semibold">
              {t?.profile?.title ?? "Massage Therapist"}
            </h1>

            {/* ⭐ Rating */}
            <div className="flex items-center gap-1 text-sm text-gray-300 mt-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-semibold">{rating}</span>
            </div>
          </div>
        </div>

        {/* Short Bio placed here */}
        {bio && (
          <p className="mt-4 text-sm text-gray-400 line-clamp-3">
            {bio.length > 150 ? bio.slice(0, 150) + "..." : bio}
          </p>
        )}

        {!!tags.length && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-full text-xs bg-amber-500/10 text-amber-300 border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 space-y-2 text-sm text-gray-300">
          {!!languages.length && (
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-gray-400" />
              <span>{languages.join(", ")}</span>
            </div>
          )}
          {typeof exp === "number" && (
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-400" />
              <span>{exp}+ years experience</span>
            </div>
          )}
        </div>

        <button
          onClick={handleSelectTherapist}
          className="mt-6 w-full rounded-full bg-primary hover:bg-amber-500 text-black font-semibold py-2.5 transition"
        >
          Select Therapist
        </button>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)} // close on overlay click
        >
          <div
            className="relative max-w-3xl w-full mx-4"
            onClick={(e) => e.stopPropagation()} // prevent modal close when clicking inside
          >
            <button
              className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <img
              src={t?.avatar_url}
              alt="Therapist"
              className="w-full h-auto max-h-[80vh] rounded-lg object-contain shadow-lg"
            />
          </div>
        </div>
      )}

    </>
  );
}
/** Pagination */
function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const go = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    onChange(p);
  };

  const pages = getPageWindow(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => go(page - 1)}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-white/10 hover:border-white/30 disabled:opacity-40"
        disabled={page <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </button>

      {pages.map((p, idx) =>
        p === "…" ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => go(p)}
            className={[
              "w-10 h-10 rounded-full border transition",
              p === page
                ? "bg-primary text-black border-primary"
                : "border-white/10 hover:border-white/30",
            ].join(" ")}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => go(page + 1)}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-white/10 hover:border-white/30 disabled:opacity-40"
        disabled={page >= totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function getPageWindow(current, total) {
  const windowSize = 3;
  const pages = new Set([1, total, current]);
  for (let i = 1; i <= windowSize; i++) {
    pages.add(current - i);
    pages.add(current + i);
  }
  const nums = [...pages]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const withDots = [];
  for (let i = 0; i < nums.length; i++) {
    withDots.push(nums[i]);
    if (i < nums.length - 1 && nums[i + 1] !== nums[i] + 1) withDots.push("…");
  }
  return withDots;
}
