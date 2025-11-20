import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import { getRoomTypeReviews, createRoomTypeReview } from "../../service/api.services";

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
        // tu api devuelve GeneralResponse en res.data
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
        // opcional: scroll hacia arriba de la lista para ver la nueva reseña
        const cont = document.getElementById("reviews-list-container");
        if (cont) cont.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err) {
      console.error("Error creating review:", err);
      alert(err?.message || err?.error || "No se pudo crear la reseña");
    }
  };

  return (
    <section id="reviews-list-container" className="bg-[#f8fafc] p-6 rounded-xl border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Reseñas</h3>

      {/* Formulario */}
      <form onSubmit={handleCreate} className="mb-6">
        <div className="flex gap-2">
          <select
            value={newRating}
            onChange={(e) => setNewRating(e.target.value)}
            className="p-2 border rounded-md bg-white"
          >
            <option value={5}>5 - Excelente</option>
            <option value={4}>4 - Muy bien</option>
            <option value={3}>3 - Regular</option>
            <option value={2}>2 - Malo</option>
            <option value={1}>1 - Muy malo</option>
          </select>

          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu reseña..."
            className="flex-1 p-2 border rounded-md"
          />

          <button className="bg-[#d4bf92] hover:bg-[#c6ae7b] text-[#1a1a1a] px-4 py-2 rounded-md font-medium">
            Enviar
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-gray-500">Cargando reseñas...</div>
      ) : reviews.length === 0 ? (
        <div className="text-gray-500">No hay reseñas aún.</div>
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
    </section>
  );
}
