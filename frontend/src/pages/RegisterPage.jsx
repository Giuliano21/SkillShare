import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    role: "student",
    subjects: "",
    hourlyPrice: "",
    bio: "",
    lessonMode: "remote",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) =>
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = { ...formData };
      if (body.role === "tutor")
        body.subjects = body.subjects
          .split(",")
          .map((subject) => subject.trim())
          .filter(Boolean);
      else {
        delete body.subjects;
        delete body.hourlyPrice;
        delete body.bio;
        delete body.lessonMode;
      }
      await register(body);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success)
    return (
      <div className="auth-layout">
        <div className="auth-aside">
          <p className="eyebrow">Profilo pronto</p>
          <h1>
            Benvenuto in
            <br />
            <em>SkillShare.</em>
          </h1>
          <p>
            La registrazione è stata completata correttamente. Ora puoi accedere
            e iniziare il tuo percorso.
          </p>
        </div>
        <div className="form-card success-card">
          <p className="form-message success">Account creato con successo.</p>
          <button
            className="button full"
            type="button"
            onClick={() => navigate("/login")}
          >
            Vai al login
          </button>
        </div>
      </div>
    );

  return (
    <div className="auth-layout register-layout">
      <div className="auth-aside">
        <p className="eyebrow">La tua prossima skill</p>
        <h1>
          Imparare è un
          <br />
          <em>atto sociale.</em>
        </h1>
        <p>
          Entra in una rete di persone che condividono tempo, esperienza e
          domande.
        </p>
      </div>
      <form className="form-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Crea il tuo profilo</p>
        <h2>Da dove vuoi partire?</h2>
        {error && <p className="form-message error">{error}</p>}
        <div className="form-grid">
          <label>
            Nome
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Cognome
            <input
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <label>
          Username
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <label className="password-toggle">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(event) => setShowPassword(event.target.checked)}
          />{" "}
          Mostra password
        </label>
        <label>
          Voglio partecipare come
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="student">Studente</option>
            <option value="tutor">Tutor</option>
          </select>
        </label>
        {formData.role === "tutor" && (
          <div className="tutor-fields">
            <label>
              Materie, separate da virgola
              <input
                name="subjects"
                value={formData.subjects}
                onChange={handleChange}
                required
              />
            </label>
            <div className="form-grid">
              <label>
                Prezzo orario
                <input
                  name="hourlyPrice"
                  type="number"
                  min="0"
                  value={formData.hourlyPrice}
                  onChange={handleChange}
                  required
                />
              </label>
              <fieldset>
                <legend>Modalità</legend>
                <label>
                  <input
                    type="radio"
                    name="lessonMode"
                    value="remote"
                    checked={formData.lessonMode === "remote"}
                    onChange={handleChange}
                  />{" "}
                  Remoto
                </label>
                <label>
                  <input
                    type="radio"
                    name="lessonMode"
                    value="presence"
                    checked={formData.lessonMode === "presence"}
                    onChange={handleChange}
                  />{" "}
                  In presenza
                </label>
              </fieldset>
            </div>
            <label>
              Racconta qualcosa di te
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        )}
        <button className="button full" type="submit" disabled={loading}>
          {loading ? "Creazione..." : "Crea profilo"}
        </button>
        <p className="form-footer">
          Hai già un account? <Link to="/login">Accedi</Link>
        </p>
      </form>
    </div>
  );
};
