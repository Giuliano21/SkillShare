import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createBooking, getMyBookings } from "../api/bookingApi";
import { createOrGetConversation } from "../api/chatApi";
import {
  createReview,
  deleteReview,
  getReviews,
  updateReview,
} from "../api/reviewApi";
import { getTutorAvailability, getTutorById } from "../api/tutorApi";

const time = (value) =>
  new Date(value).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
const dateTime = (value) =>
  new Date(value).toLocaleString("it-IT", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export const TutorDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlotIds, setSelectedSlotIds] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [completedBooking, setCompletedBooking] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [editingReview, setEditingReview] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [tutorData, slotData, reviewData] = await Promise.all([
      getTutorById(id),
      getTutorAvailability(id),
      getReviews(id),
    ]);
    setTutor(tutorData.tutor);
    setSlots(slotData.availabilitySlots || []);
    setReviews(reviewData.reviews || []);
    if (user) {
      const bookingData = await getMyBookings();
      setCompletedBooking(
        (bookingData.bookings || []).find(
          (booking) =>
            booking.tutorId?._id === id && booking.status === "completed",
        ),
      );
    }
  }, [id, user]);

  useEffect(() => {
    const timer = setTimeout(
      () => load().catch((err) => setError(err.message)),
      0,
    );
    return () => clearTimeout(timer);
  }, [load]);

  const toggleSlot = (slotId) => {
    if (selectedSlotIds.includes(slotId)) {
      setSelectedSlotIds((current) =>
        current.filter((value) => value !== slotId),
      );
      return;
    }
    const candidate = slots.find((slot) => slot._id === slotId);
    const selected = slots
      .filter((slot) => selectedSlotIds.includes(slot._id))
      .sort(
        (first, second) =>
          new Date(first.startTime) - new Date(second.startTime),
      );
    if (
      selected.length &&
      candidate &&
      new Date(candidate.startTime).getTime() !==
        new Date(selected[0].startTime).getTime() - 60 * 60 * 1000 &&
      new Date(candidate.startTime).getTime() !==
        new Date(selected[selected.length - 1].endTime).getTime()
    ) {
      setError("Per una lezione di più ore seleziona slot consecutivi.");
      return;
    }
    setError("");
    setSelectedSlotIds((current) => [...current, slotId]);
  };
  const book = async () => {
    try {
      await createBooking({
        tutorId: id,
        slotIds: selectedSlotIds,
        subject: tutor.subjects?.[0] || "Lezione",
      });
      setMessage(
        `${selectedSlotIds.length} ${selectedSlotIds.length === 1 ? "ora prenotata" : "ore prenotate"}.`,
      );
      setSlots((current) =>
        current.filter((slot) => !selectedSlotIds.includes(slot._id)),
      );
      setSelectedSlotIds([]);
    } catch (err) {
      setError(err.message);
    }
  };
  const openChat = async () => {
    try {
      await createOrGetConversation(tutor.userId?._id);
      navigate("/chat");
    } catch (err) {
      setError(err.message);
    }
  };
  const saveReview = async (event) => {
    event.preventDefault();
    try {
      if (editingReview) await updateReview(editingReview._id, reviewForm);
      else
        await createReview({
          ...reviewForm,
          tutorId: id,
          bookingId: completedBooking._id,
        });
      setEditingReview(null);
      setReviewForm({ rating: 5, comment: "" });
      const data = await getReviews(id);
      setReviews(data.reviews || []);
      setMessage("Recensione salvata.");
    } catch (err) {
      setError(err.message);
    }
  };
  const removeReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews((current) =>
        current.filter((review) => review._id !== reviewId),
      );
      setMessage("Recensione eliminata.");
    } catch (err) {
      setError(err.message);
    }
  };

  if (error && !tutor)
    return (
      <div className="content-page">
        <p className="form-message error">{error}</p>
      </div>
    );
  if (!tutor)
    return (
      <div className="content-page">
        <p className="empty-state">Caricamento tutor...</p>
      </div>
    );
  const hasReview =
    completedBooking &&
    reviews.some(
      (review) =>
        review.bookingId?._id === completedBooking._id ||
        review.bookingId === completedBooking._id,
    );

  return (
    <div className="detail-page">
      <Link className="back-link" to="/tutors/search">
        ← Torna alla ricerca
      </Link>
      <section className="detail-header">
        <div className="avatar avatar-large">
          {tutor.userId?.name?.[0] || "?"}
        </div>
        <div>
          <p className="eyebrow">Tutor SkillShare</p>
          <h1>
            {tutor.userId?.name} {tutor.userId?.surname}
          </h1>
          <p className="lead">{tutor.bio}</p>
          <div className="tag-list">
            {tutor.subjects?.map((subject) => (
              <span key={subject}>{subject}</span>
            ))}
          </div>
          <div className="detail-header-actions">
            <button
              className="button button-ghost button-small"
              onClick={openChat}
            >
              Scrivi al tutor
            </button>
          </div>
        </div>
        <div className="detail-price">
          <strong>{tutor.hourlyPrice} €</strong>
          <span>per ora</span>
          <small>
            {tutor.rating || "—"} ★ · {tutor.reviewsCount || 0} recensioni
          </small>
        </div>
      </section>
      {message && <p className="form-message success">{message}</p>}
      {error && <p className="form-message error">{error}</p>}
      <div className="detail-columns">
        <section>
          <div className="section-heading">
            <h2>Orari disponibili</h2>
            <span>
              {(Array.isArray(tutor.lessonMode)
                ? tutor.lessonMode
                : [tutor.lessonMode]
              )
                .map((mode) => (mode === "presence" ? "In presenza" : "Remoto"))
                .join(" · ")}
            </span>
          </div>
          <div className="slot-list">
            {slots.length ? (
              slots.map((slot) => (
                <label className="slot-row slot-choice" key={slot._id}>
                  <span>
                    {dateTime(slot.startTime)} – {time(slot.endTime)}{" "}
                    <small>(1 ora)</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedSlotIds.includes(slot._id)}
                    onChange={() => toggleSlot(slot._id)}
                  />
                </label>
              ))
            ) : (
              <p className="empty-state">
                Nessuno slot disponibile al momento.
              </p>
            )}
          </div>
          {selectedSlotIds.length > 0 && (
            <div className="booking-selection">
              <strong>
                {selectedSlotIds.length}{" "}
                {selectedSlotIds.length === 1
                  ? "ora selezionata"
                  : "ore selezionate"}
              </strong>
              <button className="button" onClick={book}>
                Prenota selezione
              </button>
            </div>
          )}
        </section>
        <section>
          <div className="section-heading">
            <h2>Recensioni</h2>
            <span>{reviews.length}</span>
          </div>
          <div className="reviews-list">
            {reviews.length ? (
              reviews.map((review) => (
                <article className="review" key={review._id}>
                  <strong>{"★".repeat(review.rating)}</strong>
                  <p>{review.comment}</p>
                  <small>{review.userId?.username || "Studente"}</small>
                  {review.userId?._id === user?.id && (
                    <div className="row-actions">
                      <button
                        className="text-link"
                        onClick={() => {
                          setEditingReview(review);
                          setReviewForm({
                            rating: review.rating,
                            comment: review.comment || "",
                          });
                        }}
                      >
                        Modifica
                      </button>
                      <button
                        className="danger-link"
                        onClick={() => removeReview(review._id)}
                      >
                        Elimina
                      </button>
                    </div>
                  )}
                </article>
              ))
            ) : (
              <p className="empty-state">Ancora nessuna recensione.</p>
            )}
          </div>
          {completedBooking && !hasReview && (
            <form className="review-form" onSubmit={saveReview}>
              <h3>Lascia una recensione</h3>
              <label>
                Valutazione
                <select
                  value={reviewForm.rating}
                  onChange={(event) =>
                    setReviewForm({
                      ...reviewForm,
                      rating: Number(event.target.value),
                    })
                  }
                >
                  <option value="5">5 stelle</option>
                  <option value="4">4 stelle</option>
                  <option value="3">3 stelle</option>
                  <option value="2">2 stelle</option>
                  <option value="1">1 stella</option>
                </select>
              </label>
              <label>
                Commento
                <textarea
                  value={reviewForm.comment}
                  onChange={(event) =>
                    setReviewForm({
                      ...reviewForm,
                      comment: event.target.value,
                    })
                  }
                  maxLength="200"
                  required
                />
              </label>
              <button className="button" type="submit">
                Pubblica recensione
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};
