import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Filterbar } from "../components/Filterbar";
import { getAllTutors } from "../api/tutorApi";
import { getMyBookings } from "../api/bookingApi";
import { createOrGetConversation } from "../api/chatApi";
import { useAuth } from "../context/AuthContext";
import { normalizeRoles } from "../utils/roles";
import { TutorDashboardPage } from "./TutorDashboardPage";

const TutorCard = ({ tutor, onChat, canChat }) => (
  <article className="tutor-card">
    <Link className="tutor-card-link" to={`/tutors/${tutor._id}`}>
      <div className="avatar" aria-hidden="true">
        {tutor.userId?.name?.[0] || "?"}
      </div>
      <div>
        <div className="card-top">
          <h3>
            {tutor.userId?.name} {tutor.userId?.surname}
          </h3>
          <span
            aria-label={`Valutazione ${Number(tutor.rating || 0).toFixed(1)} su 5`}
          >
            {Number(tutor.rating || 0).toFixed(1)} ★
          </span>
        </div>
        <p>{tutor.subjects?.join(" · ") || "Materie non indicate"}</p>
        <div className="card-meta">
          <span>
            {(Array.isArray(tutor.lessonMode)
              ? tutor.lessonMode
              : [tutor.lessonMode]
            )
              .map((mode) => (mode === "presence" ? "In presenza" : "Remoto"))
              .join(" · ")}
          </span>
          <strong>{tutor.hourlyPrice} €/h</strong>
        </div>
      </div>
    </Link>
    {canChat && (
      <button
        className="chat-button"
        type="button"
        aria-label={`Apri la chat con ${tutor.userId?.name || "il tutor"}`}
        title="Chatta con il tutor"
        onClick={() => onChat(tutor.userId?._id)}
      >
        <span aria-hidden="true">✉</span>
      </button>
    )}
  </article>
);

const loadTutors = async (
  nextFilters,
  setLoading,
  setError,
  setBestTutors,
  setNewTutors,
) => {
  setLoading(true);
  setError("");
  const cleaned = Object.fromEntries(
    Object.entries(nextFilters).filter(([, value]) => value !== ""),
  );
  try {
    const [best, newest] = await Promise.all([
      getAllTutors({ ...cleaned, sort: "rating" }),
      getAllTutors({ ...cleaned, sort: "newest" }),
    ]);
    setBestTutors((best.tutors || []).slice(0, 3));
    setNewTutors((newest.tutors || []).slice(0, 3));
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

export const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const roles = normalizeRoles(user);
  const isStudent = Boolean(user && roles.includes("student"));
  const [filters, setFilters] = useState({
    subject: "",
    minPrice: "",
    maxPrice: "",
    lessonMode: "",
  });
  const [bestTutors, setBestTutors] = useState([]);
  const [newTutors, setNewTutors] = useState([]);
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openChat = async (peerUserId) => {
    try {
      await createOrGetConversation(peerUserId);
      navigate("/chat");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const [best, newest] = await Promise.all([
          getAllTutors({ sort: "rating" }),
          getAllTutors({ sort: "newest" }),
        ]);
        setBestTutors((best.tutors || []).slice(0, 3));
        setNewTutors((newest.tutors || []).slice(0, 3));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isStudent) return undefined;
    getMyBookings()
      .then((data) =>
        setAcceptedBookings(
          (data.bookings || [])
            .filter(
              (booking) =>
                booking.status === "accepted" && booking.slotId?.startTime,
            )
            .sort(
              (first, second) =>
                new Date(first.slotId.startTime) -
                new Date(second.slotId.startTime),
            ),
        ),
      )
      .catch(() => setAcceptedBookings([]));
    return undefined;
  }, [isStudent]);

  if (roles.includes("tutor")) return <TutorDashboardPage />;

  return (
    <div className="home-page home-search-page">
      {!user && (
        <>
          <section className="home-search-hero">
            <div>
              <p className="eyebrow">SkillShare </p>
              <h1>Trova il tutor giusto per i tuoi studi.</h1>
              <p className="hero-text">
                SkillShare è una piattaforma dove studenti e tutor si
                incontrano. Confronta i tutor per prezzo, materie e modalità di
                lezione. Dopo aver prenotato contatta il tutor nella chat
                disponibile nel sito.
              </p>
            </div>
          </section>
          <section className="home-info">
            <div>
              <p className="eyebrow">Come funziona SkillShare?</p>
              <h2>Un modo semplice per trovare l'insegnante giusto per te</h2>
            </div>
            <div className="info-points">
              <article>
                <strong>01</strong>
                <h3>Confronta</h3>
                <p>
                  Filtra per materia, prezzo e modalità di lezione per trovare
                  tutor adatti alle tue esigenze
                </p>
              </article>
              <article>
                <strong>02</strong>
                <h3>Prenota</h3>
                <p>
                  Scegli uno o più slot consecutivi da 1 ora in modo da
                  personalizzare la tua lezione
                </p>
              </article>
              <article>
                <strong>03</strong>
                <h3>Comunica</h3>
                <p>
                  Chatta con il tutor (previa prenotazione accettata) e lascia
                  una recensione al completamento della lezione
                </p>
              </article>
            </div>
          </section>
        </>
      )}
      <main className="home-search-main">
        {isStudent && (
          <section
            className="panel booking-summary"
            aria-labelledby="accepted-bookings-title"
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">Resoconto delle prossime lezioni</p>
                <h2 id="accepted-bookings-title">Prenotazioni accettate</h2>
              </div>
              <Link className="text-link" to="/bookings">
                Vedi tutte
              </Link>
            </div>
            {acceptedBookings.length ? (
              <div className="booking-summary-list">
                {acceptedBookings.slice(0, 4).map((booking) => (
                  <div className="dashboard-item" key={booking._id}>
                    <div>
                      <strong>
                        <Link
                          className="text-link"
                          to={`/tutors/${booking.tutorId?._id}`}
                        >
                          {booking.tutorId?.userId?.name || "Tutor"}{" "}
                          {booking.tutorId?.userId?.surname || ""}
                        </Link>
                      </strong>
                      <span>{booking.subject || "Lezione"}</span>
                    </div>
                    <span>
                      {new Date(booking.slotId.startTime).toLocaleString(
                        "it-IT",
                        { dateStyle: "medium", timeStyle: "short" },
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">
                Non hai ancora prenotazioni accettate.
              </p>
            )}
          </section>
        )}
        <Filterbar
          filters={filters}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              [event.target.name]: event.target.value,
            }))
          }
          onSearch={() =>
            loadTutors(
              filters,
              setLoading,
              setError,
              setBestTutors,
              setNewTutors,
            )
          }
        />
        {error && <p className="form-message error">{error}</p>}
        {loading ? (
          <p className="empty-state" role="status">
            Sto cercando i tutor migliori per te...
          </p>
        ) : (
          <div className="tutor-rails">
            <section className="tutor-rail">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">I più votati</p>
                  <h2>Migliori per recensioni</h2>
                </div>
                <span>Top 3</span>
              </div>
              {bestTutors.length ? (
                <div className="tutor-grid">
                  {bestTutors.map((tutor) => (
                    <TutorCard
                      key={tutor._id}
                      tutor={tutor}
                      onChat={openChat}
                      canChat={isStudent}
                    />
                  ))}
                </div>
              ) : (
                <p className="empty-state">
                  Nessun tutor corrisponde ai filtri.
                </p>
              )}
            </section>
            <section className="tutor-rail">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Nuovi tutor</p>
                  <h2>Tutor appena iscritti</h2>
                </div>
                <span>Nuovi</span>
              </div>
              {newTutors.length ? (
                <div className="tutor-grid">
                  {newTutors.map((tutor) => (
                    <TutorCard
                      key={tutor._id}
                      tutor={tutor}
                      onChat={openChat}
                      canChat={isStudent}
                    />
                  ))}
                </div>
              ) : (
                <p className="empty-state">Nessun nuovo tutor disponibile.</p>
              )}
            </section>
          </div>
        )}
        <div className="home-all-tutors">
          <Link className="button" to="/tutors/search">
            Mostra tutti i tutor <span>↗</span>
          </Link>
        </div>
      </main>
    </div>
  );
};
