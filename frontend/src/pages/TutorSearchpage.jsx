import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllTutors } from "../api/tutorApi";
import { createOrGetConversation } from "../api/chatApi";
import { Filterbar } from "../components/Filterbar";
import { useAuth } from "../context/AuthContext";

export const TutorSearchpage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const roles = Array.isArray(user?.role) ? user.role : [user?.role];
  const [tutors, setTutors] = useState([]);
  const [filters, setFilters] = useState({
    subject: "",
    minPrice: "",
    maxPrice: "",
    lessonMode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const openChat = async (peerUserId) => {
    try {
      await createOrGetConversation(peerUserId);
      navigate("/chat");
    } catch (err) {
      setError(err.message);
    }
  };

  const search = async () => {
    setError("");
    try {
      setLoading(true);
      // Rimuovo i filtri vuoti per evitare di inviare parametri non necessari
      const cleaned = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v != ""),
      );
      const data = await getAllTutors(cleaned);
      setTutors(data.tutors || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      setError("");
      setLoading(true);
      try {
        const data = await getAllTutors();
        setTutors(data.tutors || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="content-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Trova il tuo prossimo punto di vista</p>
          <h1>Cerca un tutor.</h1>
        </div>
        <span className="result-count">{tutors.length} risultati</span>
      </div>
      <Filterbar filters={filters} onChange={handleChange} onSearch={search} />
      {error && (
        <p className="form-message error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="empty-state" role="status">
          Cerco le persone giuste per te...
        </p>
      ) : tutors.length ? (
        <div className="tutor-grid">
          {tutors.map((tutor) => (
            <article className="tutor-card" key={tutor._id || tutor.id}>
              <Link
                className="tutor-card-link"
                to={`/tutors/${tutor._id || tutor.id}`}
              >
                <div className="avatar" aria-hidden="true">
                  {tutor.userId?.name?.[0] || "?"}
                </div>
                <div>
                  <div className="card-top">
                    <h3>
                      {tutor.userId?.name} {tutor.userId?.surname}
                    </h3>
                    <span
                      aria-label={`Valutazione ${tutor.rating || "non disponibile"} su 5`}
                    >
                      {tutor.rating || "—"} ★
                    </span>
                  </div>
                  <p>{tutor.subjects?.join(" · ")}</p>
                  <div className="card-meta">
                    <span>
                      {(Array.isArray(tutor.lessonMode)
                        ? tutor.lessonMode
                        : [tutor.lessonMode]
                      )
                        .map((mode) =>
                          mode === "presence" ? "In presenza" : "Remoto",
                        )
                        .join(" · ")}
                    </span>
                    <strong>{tutor.hourlyPrice} €/h</strong>
                  </div>
                </div>
              </Link>
              {user && roles.includes("student") && (
                <button
                  className="chat-button"
                  type="button"
                  aria-label={`Apri la chat con ${tutor.userId?.name || "il tutor"}`}
                  title="Chatta con il tutor"
                  onClick={() => openChat(tutor.userId?._id)}
                >
                  <span aria-hidden="true">✉</span>
                </button>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-state">
          Nessun tutor corrisponde ai filtri scelti.
        </p>
      )}
    </div>
  );
};

export { TutorSearchpage as TutorSearchPage };
