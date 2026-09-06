import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookings, updateBookingStatus } from "../api/bookingApi";
import { getReviews } from "../api/reviewApi";
import { getMyTutor, getTutorAvailability } from "../api/tutorApi";

export const TutorDashboardPage = () => {
  const [tutor, setTutor] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const tutorData = await getMyTutor();
    const tutorProfile = tutorData.tutor;
    const [bookingData, reviewData, slotData] = await Promise.all([
      getMyBookings(),
      getReviews(tutorProfile._id),
      getTutorAvailability(tutorProfile._id),
    ]);
    setTutor(tutorProfile);
    setBookings(bookingData.bookings || []);
    setReviews(reviewData.reviews || []);
    setSlots(slotData.availabilitySlots || []);
  };

  useEffect(() => {
    const timer = setTimeout(
      () => load().catch((err) => setError(err.message)),
      0,
    );
    return () => clearTimeout(timer);
  }, []);

  const update = async (id, status) => {
    try {
      await updateBookingStatus(id, { status });
      setMessage(
        status === "accepted"
          ? "Prenotazione accettata."
          : "Lezione completata.",
      );
      await load();
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
        <p className="empty-state">Caricamento dashboard...</p>
      </div>
    );

  const pending = bookings.filter((booking) => booking.status === "pending");
  const nextBookings = bookings
    .filter(
      (booking) => booking.status === "accepted" && booking.slotId?.startTime,
    )
    .sort((a, b) => new Date(a.slotId.startTime) - new Date(b.slotId.startTime))
    .slice(0, 3);

  return (
    <div className="content-page tutor-dashboard">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Il tuo spazio di lavoro</p>
          <h1>Ciao, {tutor.userId?.name || "tutor"}.</h1>
        </div>
        <div className="dashboard-actions">
          <Link
            className="message-launcher"
            to="/chat"
            aria-label="Apri i messaggi"
            title="Apri i messaggi"
          >
            <span>✉</span>
            <small>Messaggi</small>
          </Link>
          <Link className="button" to="/profile">
            Modifica profilo
          </Link>
        </div>
      </div>
      {message && <p className="form-message success">{message}</p>}
      {error && <p className="form-message error">{error}</p>}
      <div className="dashboard-grid">
        <section className="panel dashboard-panel dashboard-wide">
          <div className="section-heading">
            <h2>Richieste in attesa</h2>
            <span>{pending.length}</span>
          </div>
          {pending.length ? (
            pending.map((booking) => (
              <article className="booking-row" key={booking._id}>
                <div>
                  <strong>
                    {booking.userId?._id ? (
                      <Link
                        className="text-link"
                        to={`/users/${booking.userId._id}`}
                      >
                        {booking.userId?.name ||
                          booking.userId?.username ||
                          "Studente"}{" "}
                        {booking.userId?.surname || ""}
                      </Link>
                    ) : (
                      "Studente"
                    )}
                  </strong>
                  <p>
                    {booking.subject || "Lezione"} ·{" "}
                    {booking.slotId?.startTime
                      ? new Date(booking.slotId.startTime).toLocaleString(
                          "it-IT",
                          { dateStyle: "medium", timeStyle: "short" },
                        )
                      : "Orario da verificare"}
                  </p>
                </div>
                <div className="row-actions">
                  <button
                    className="button button-small"
                    onClick={() => update(booking._id, "accepted")}
                  >
                    Accetta
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="empty-state">Nessuna richiesta da gestire.</p>
          )}
        </section>
        <section className="panel dashboard-panel">
          <div className="section-heading">
            <h2>La tua valutazione</h2>
            <span>{tutor.reviewsCount || 0} recensioni</span>
          </div>
          <div className="rating-summary">
            <strong>{Number(tutor.rating || 0).toFixed(1)}</strong>
            <span>★ media</span>
          </div>
          <div className="reviews-list">
            {reviews.slice(0, 3).map((review) => (
              <article className="review" key={review._id}>
                <strong>{"★".repeat(review.rating)}</strong>
                <p>{review.comment}</p>
                <small>{review.userId?.username || "Studente"}</small>
              </article>
            ))}
            {!reviews.length && (
              <p className="empty-state">
                Le recensioni ricevute appariranno qui.
              </p>
            )}
          </div>
        </section>
        <section className="panel dashboard-panel">
          <div className="section-heading">
            <h2>Prossime lezioni</h2>
            <Link className="text-link" to="/bookings">
              Vedi tutte
            </Link>
          </div>
          {nextBookings.length ? (
            nextBookings.map((booking) => (
              <div className="dashboard-item" key={booking._id}>
                <strong>
                  {booking.userId?._id ? (
                    <Link
                      className="text-link"
                      to={`/users/${booking.userId._id}`}
                    >
                      {booking.userId?.name ||
                        booking.userId?.username ||
                        "Studente"}{" "}
                      {booking.userId?.surname || ""}
                    </Link>
                  ) : (
                    "Studente"
                  )}
                </strong>
                <span>
                  {new Date(booking.slotId.startTime).toLocaleString("it-IT", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            ))
          ) : (
            <p className="empty-state">Nessuna prenotazione accettata.</p>
          )}
        </section>
        <section className="panel dashboard-panel">
          <div className="section-heading">
            <h2>Disponibilità</h2>
            <Link className="text-link" to="/tutor/availability">
              Gestisci
            </Link>
          </div>
          {slots.slice(0, 4).map((slot) => (
            <div className="dashboard-item" key={slot._id}>
              <span>
                {new Date(slot.startTime).toLocaleString("it-IT", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
              <strong>{slot.isBooked ? "Prenotato" : "Libero"}</strong>
            </div>
          ))}
          {!slots.length && (
            <p className="empty-state">Aggiungi il primo slot.</p>
          )}
        </section>
      </div>
    </div>
  );
};
