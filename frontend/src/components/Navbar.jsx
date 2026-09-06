import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const roles = Array.isArray(user?.role) ? user.role : [user?.role];
  const isTutor = roles.includes("tutor");

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        skill<span>share</span>
        <b>.</b>
      </Link>
      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        {!isTutor && <NavLink to="/tutors/search">Cerca tutor</NavLink>}
        {user && <NavLink to="/bookings">Prenotazioni</NavLink>}
        {user && !isTutor && (
          <NavLink to="/reviews/mine">Le mie recensioni</NavLink>
        )}
        {isTutor && <NavLink to="/tutor/availability">Disponibilità</NavLink>}
      </nav>
      <div className="nav-actions">
        {user ? (
          <>
            <NavLink
              className="nav-icon-link"
              to="/chat"
              aria-label="Apri chat"
              title="Apri chat"
            >
              ✉
            </NavLink>
            <NavLink className="profile-link" to="/profile">
              {user.name || user.username || "Profilo"}
            </NavLink>
            <button
              className="button button-ghost button-small"
              onClick={signOut}
            >
              Esci
            </button>
          </>
        ) : (
          <>
            <Link className="button button-ghost button-small" to="/login">
              Accedi
            </Link>
            <Link className="button button-small" to="/register">
              Inizia
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
