import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  cancelBooking,
  getMyBookings,
  updateBookingStatus,
} from "../api/bookingApi";
import { createOrGetConversation } from "../api/chatApi";
import { useAuth } from "../context/AuthContext";

export const BookingsPage = () => {
  const { user } = useAuth();
  const roles = Array.isArray(user?.role) ? user.role : [user?.role];
  const isTutor = roles.includes("tutor");
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const data = await getMyBookings();
    const nextBookings = data.bookings || [];
    setBookings(nextBookings);
    if (!isTutor) {
      await Promise.all(
        nextBookings
          .filter(
            (booking) =>
              booking.status === "accepted" && booking.tutorId?.userId?._id,
          )
          .map(async (booking) => {
            try {
              await createOrGetConversation(booking.tutorId.userId._id);
            } catch {
              // La prenotazione resta visibile anche se la chat non è disponibile.
            }
          }),
      );
    }
  }, [isTutor]);

  useEffect(() => {
    const timer = setTimeout(() => {
      load().catch((error) => setMessage(error.message));
    }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const cancel = async (id) => {
    try {
      await cancelBooking(id);
      setMessage("Prenotazione cancellata.");
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const update = async (id, status) => {
    try {
      await updateBookingStatus(id, { status });
      if (status === "accepted") {
        const acceptedBooking = bookings.find((booking) => booking._id === id);
        const peerUserId = acceptedBooking?.userId?._id;
        if (peerUserId) {
          try {
            await createOrGetConversation(peerUserId);
          } catch {
            setMessage("Prenotazione accettata. Chat non ancora disponibile.");
          }
        }
      }
      setMessage("Stato aggiornato.");
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="content-page narrow-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Il tuo percorso</p>
          <h1>{isTutor ? "Lezioni da seguire." : "Le tue lezioni."}</h1>
        </div>
      </div>
      {message && <p className="form-message success">{message}</p>}
      <div className="booking-list">
        {bookings.length ? (
          bookings.map((booking) => {
            const student =
              `${booking.userId?.name || booking.userId?.username || "Studente"} ${booking.userId?.surname || ""}`.trim();
            const tutor =
              `${booking.tutorId?.userId?.name || ""} ${booking.tutorId?.userId?.surname || ""}`.trim() ||
              "Tutor";
            const start = booking.slotId?.startTime
              ? new Date(booking.slotId.startTime)
              : null;
            const end = booking.slotIds?.length
              ? new Date(booking.slotIds[booking.slotIds.length - 1].endTime)
              : booking.slotId?.endTime
                ? new Date(booking.slotId.endTime)
                : null;
            const duration = booking.slotIds?.length || 1;
            return (
              <article className="booking-row" key={booking._id}>
                <div>
                  <span className={`status status-${booking.status}`}>
                    {booking.status}
                  </span>
                  <h3>{booking.subject || "Lezione"}</h3>
                  <p>
                    <strong>Studente:</strong>{" "}
                    {isTutor && booking.userId?._id ? (
                      <Link
                        className="text-link"
                        to={`/users/${booking.userId._id}`}
                      >
                        {student}
                      </Link>
                    ) : (
                      student
                    )}
                  </p>
                  <p>
                    <strong>Tutor:</strong>{" "}
                    {!isTutor && booking.tutorId?._id ? (
                      <Link
                        className="text-link"
                        to={`/tutors/${booking.tutorId._id}`}
                      >
                        {tutor}
                      </Link>
                    ) : (
                      tutor
                    )}
                  </p>
                  <p>
                    {start
                      ? `${start.toLocaleDateString("it-IT", { dateStyle: "medium" })} ${start.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}–${end ? end.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) : ""} · ${duration} ${duration === 1 ? "ora" : "ore"}`
                      : "Orario da definire"}
                  </p>
                </div>
                <div className="row-actions">
                  {isTutor && booking.status === "pending" && (
                    <button
                      className="button button-small"
                      onClick={() => update(booking._id, "accepted")}
                    >
                      Accetta
                    </button>
                  )}
                  {isTutor && booking.status === "accepted" && (
                    <button
                      className="button button-small"
                      onClick={() => update(booking._id, "completed")}
                    >
                      Completa
                    </button>
                  )}
                  {!isTutor &&
                    !["cancelled", "completed"].includes(booking.status) && (
                      <button
                        className="button button-ghost button-small"
                        onClick={() => cancel(booking._id)}
                      >
                        Annulla
                      </button>
                    )}
                </div>
              </article>
            );
          })
        ) : (
          <p className="empty-state">Non ci sono prenotazioni.</p>
        )}
      </div>
    </div>
  );
};
