import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPublicProfile } from "../api/userApi";

export const PublicProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPublicProfile(id);
        setProfile(data.user);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [id]);

  if (error || !profile)
    return (
      <div className="content-page">
        <p className={error ? "form-message error" : "empty-state"}>
          {error || "Caricamento profilo..."}
        </p>
      </div>
    );
  const roles = Array.isArray(profile.role) ? profile.role : [profile.role];

  return (
    <div className="content-page narrow-page">
      <Link className="back-link" to="/bookings">
        ← Torna alle prenotazioni
      </Link>
      <section className="panel public-profile">
        <div className="avatar avatar-large">{profile.name?.[0] || "?"}</div>
        <p className="eyebrow">Profilo SkillShare</p>
        <h1>
          {profile.name} {profile.surname}
        </h1>
        <p className="lead">
          {roles.includes("tutor") ? "Tutor" : "Studente"} · @{profile.username}
        </p>
      </section>
    </div>
  );
};
