import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function TherapistReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Quick reply templates based on rating
  const quickReplies = {
    positive: [
      "Thank you so much for your wonderful feedback! We're thrilled to hear you had a great experience with us. Your satisfaction means the world to our team, and we look forward to serving you again soon! 🌟",
      "We truly appreciate your kind words! It's feedback like yours that motivates our team to continue providing excellent service. Thank you for choosing us, and we can't wait to see you again! 💙",
      "What a lovely review! Thank you for taking the time to share your positive experience. We're so glad our therapist could meet your expectations. Looking forward to your next visit! ✨"
    ],
    neutral: [
      "Thank you for your feedback! We're glad you had a decent experience with us. We're always looking for ways to improve, so if there's anything specific we could do better, please let us know. We hope to serve you again soon!",
      "We appreciate you sharing your thoughts with us. While we're happy you chose our service, we'd love to exceed your expectations next time. Feel free to reach out if you have any suggestions for improvement!",
      "Thanks for your review! We value your honest feedback and are committed to continuously improving our services. We hope to provide you with an even better experience in the future!"
    ],
    negative: [
      "We sincerely apologize that your experience didn't meet your expectations. Your feedback is incredibly valuable to us, and we take it very seriously. We'd love the opportunity to make this right and discuss how we can improve. Please contact us directly so we can address your concerns personally. Thank you for bringing this to our attention.",
      "We're truly sorry to hear about your disappointing experience. This is not the level of service we strive to provide, and we deeply regret that we fell short. We're actively working on improvements and would appreciate the chance to regain your trust. Please reach out to us so we can discuss this further and make it right.",
      "Thank you for your honest feedback, and we sincerely apologize for the issues you encountered. We take full responsibility and are committed to doing better. Your experience matters greatly to us, and we'd like to offer you a complimentary session to restore your confidence in our services. Please contact our support team."
    ]
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${apiUrl}/admin/booking/reviews`);
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [apiUrl]);

  const openReplyModal = (review) => {
    setSelectedReview(review);
    setReplyText("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
    setReplyText("");
  };

  const handleQuickReply = (template) => {
    setReplyText(template);
  };

  const getQuickReplyCategory = (rating) => {
    if (rating >= 4) return 'positive';
    if (rating >= 3) return 'neutral';
    return 'negative';
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${apiUrl}/admin/booking/reviews/${selectedReview.bookingId}/reply`,
        { reply: replyText }
      );

      toast.success("Reply sent successfully!");
      closeModal();
    } catch (err) {
      console.error("Failed to send reply:", err);
      toast.error("Failed to send reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-400';
    if (rating >= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRatingBgColor = (rating) => {
    if (rating >= 4) return 'bg-green-500/10 border-green-500/30';
    if (rating >= 3) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#111] text-white px-6 py-12">
      <header className="mb-12 max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-3xl font-bold bg-primary to-primary bg-clip-text text-transparent tracking-tight mb-3">
          Therapist Reviews
        </h1>
        <p className="text-gray-400 text-lg">Manage and respond to customer feedback</p>
      </header>

      <section className="bg-gradient-to-br from-[#111] to-[#0f0f0f] w-full max-w-6xl mx-auto rounded-3xl py-10 px-6 shadow-2xl border border-gray-800/50">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-400">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-400 text-lg">No reviews found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="py-4 px-4 font-semibold text-sm uppercase tracking-wider">Therapist</th>
                  <th className="py-4 px-4 font-semibold text-sm uppercase tracking-wider">Client</th>
                  <th className="py-4 px-4 font-semibold text-sm uppercase tracking-wider">Service</th>
                  <th className="py-4 px-4 font-semibold text-sm uppercase tracking-wider">Date</th>
                  <th className="py-4 px-4 font-semibold text-sm uppercase tracking-wider">Rating</th>
                  <th className="py-4 px-4 font-semibold text-sm uppercase tracking-wider">Comment</th>
                  <th className="py-4 px-4 text-center font-semibold text-sm uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r, i) => (
                  <tr
                    key={r.bookingId || i}
                    className="border-b border-gray-800/50 hover:bg-[#1a1a1a]/50 transition-all duration-200"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">{r.therapist}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">{r.user.first} {r.user?.last}</div>
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm">
                      {r.selectedServices}
                    </td>
                    <td className="py-4 px-4 text-gray-400 text-sm">
                      {new Date(r.serviceDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`${getRatingColor(r.rating)} font-bold text-lg`}>
                        {r.rating} ★
                      </span>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <p className="truncate text-gray-300 text-sm">{r.comment}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        className="bg-primary text-black font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all duration-200 transform hover:scale-105"
                        onClick={() => openReplyModal(r)}
                      >
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="bg-gradient-to-br from-[#111] to-[#0d0d0d] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-gray-800 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-2xl font-bold bg-primary bg-clip-text text-transparent">
                  Reply to Review
                </h2>
                <p className="text-gray-400 text-xs mt-1">Respond to customer feedback</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white text-3xl leading-none transition-colors"
              >
                ×
              </button>
            </div>

            <div className={`${getRatingBgColor(selectedReview.rating)} rounded-xl p-4 mb-4 border`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-lg font-bold text-white">
                    {selectedReview.therapist}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedReview.selectedServices}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`${getRatingColor(selectedReview.rating)} font-bold text-xl`}>
                    {selectedReview.rating} ★
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(selectedReview.serviceDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="bg-[#0d0d0d]/50 rounded-lg p-3">
                <p className="text-gray-200 text-sm leading-relaxed">
                  {selectedReview.comment}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Quick Reply Templates
              </label>
              <div className="grid grid-cols-1 gap-2 mb-3">
                {quickReplies[getQuickReplyCategory(selectedReview.rating)].map((template, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickReply(template)}
                    className="text-left bg-[#1a1a1a] hover:bg-[#222] border border-gray-800 hover:border-primary/50 rounded-lg p-3 text-xs text-gray-300 transition-all duration-200"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-primary text-sm flex-shrink-0">💬</span>
                      <span className="line-clamp-2">{template}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Your Custom Reply
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your personalized reply..."
                rows="4"
                className="w-full bg-[#0d0d0d] text-white text-sm border border-gray-700 focus:border-primary rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-1">
                {replyText.length} characters
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-semibold text-sm transition-all duration-200"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleReplySubmit}
                disabled={submitting || !replyText.trim()}
                className="px-6 py-2 bg-primary text-black rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-primary/50 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-black"></div>
                    Sending...
                  </span>
                ) : (
                  "Send Reply"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
