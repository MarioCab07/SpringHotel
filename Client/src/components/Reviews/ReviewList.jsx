import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import { getRoomTypeReviews, createRoomTypeReview } from "../../service/api.services";
import { FaStar } from "react-icons/fa";

export default function ReviewsList({ roomTypeId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    if (!roomTypeId) return;
    setLoading(true);
    (async () => {
      try {
        const res = await getRoomTypeReviews(roomTypeId);
        const arr = res?.data?.data || [];
        setReviews(arr);
      } catch (err) {
        console.error("Error loading reviews:", err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [roomTypeId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    if (!token) return alert("Inicia sesión para comentar.");
    if (!newComment.trim()) return alert("Escribe un comentario.");

    try {
      const res = await createRoomTypeReview(roomTypeId, {
        rating: Number(newRating),
        comment: newComment.trim(),
      });
      const created = res?.data?.data;
      if (created) {
        setReviews((p) => [created, ...p]);
        setNewComment("");
        setNewRating(5);
        const cont = document.getElementById("reviews-list-container");
        if (cont) cont.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err) {
      console.error("Error creating review:", err);
      alert(err?.message || err?.error || "No se pudo crear la reseña");
    }
  };

  return (
    <section id="reviews-list-container" className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <FaStar className="text-[#d4bf92] text-2xl" />
          <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: '"Playfair Display", serif' }}>
            Guest Reviews
          </h3>
        </div>
        <p className="text-gray-600 mt-2">Share your experience with other travelers</p>
      </div>

      <div className="p-8">

        {/* Formulario */}
        <form onSubmit={handleCreate} className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-4">Write a Review</h4>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <FaStar
                    key={starValue}
                    className={`cursor-pointer text-2xl ${starValue <= newRating ? "text-[#d4bf92]" : "text-gray-300"
                      }`}
                    onClick={() => setNewRating(starValue)}
                  />
                ))}
                <span className="text-gray-600 text-lg ml-2">
                  {newRating === 5 && "Excellent"}
                  {newRating === 4 && "Very good"}
                  {newRating === 3 && "Good"}
                  {newRating === 2 && "Bad"}
                  {newRating === 1 && "Terrible"}
                </span>
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-[#d4bf92] to-[#c6ae7b] hover:from-[#c6ae7b] hover:to-[#b89d6c] text-white rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap ml-auto"
              >
                Submit Review
              </button>
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about your stay..."
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-[#d4bf92] focus:border-[#d4bf92] focus:outline-none transition-colors resize-none"
            />
          </div>
        </form>

        {/* Reviews List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#d4bf92]"></div>
              <p className="text-gray-500 mt-4">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <FaStar className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No reviews yet.</p>
              <p className="text-gray-400 text-sm mt-2">Be the first to share your experience!</p>
            </div>
          ) : (
            reviews.map((r) => (
              <ReviewCard
                key={r.id}
                userName={r.userName || `Usuario ${r.userName}`}
                rating={r.rating}
                comment={r.comment}
                createdAt={r.createdAt}
              />
            ))
          )}
        </div>

      </div>
    </section>
  );
}
