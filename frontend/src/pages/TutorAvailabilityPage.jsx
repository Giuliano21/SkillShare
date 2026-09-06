import { useEffect, useState } from "react";
import {
  getTutorAvailability,
  addtutorAvailability,
  deleteTutorAvailability,
  getMyTutor,
  updateTutorAvailability,
} from "../api/tutorApi";

export const TutorAvailabilityPage = () => {
  const [tutorId, setTutorId] = useState(null);
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ startTime: "", endTime: "" });
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const formatLocalDateTime = (date) => {
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const load = async () => {
    const data = await getMyTutor();
    const id = data.tutor?._id;
    setTutorId(id);
    if (id) {
      const data = await getTutorAvailability(id);
      setSlots(data.availabilitySlots || []);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      load().catch((error) => setMessage(error.message));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const setStartTime = (value) =>
    setForm((current) => ({ ...current, startTime: value }));

  const submit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      };
      if (editingId) await updateTutorAvailability(editingId, payload);
      else await addtutorAvailability(tutorId, payload);
      setForm({ startTime: "", endTime: "" });
      setEditingId(null);
      setMessage(
        editingId ? "Disponibilità aggiornata." : "Disponibilità aggiunta.",
      );
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const edit = (slot) => {
    setEditingId(slot._id);
    setForm({
      startTime: formatLocalDateTime(new Date(slot.startTime)),
      endTime: formatLocalDateTime(new Date(slot.endTime)),
    });
  };
  const remove = async (id) => {
    try {
      await deleteTutorAvailability(id);
      setMessage("Disponibilità eliminata.");
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="content-page narrow-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Organizza il tuo tempo</p>
          <h1>Le tue disponibilità.</h1>
        </div>
      </div>
      <section className="panel">
        <h2>{editingId ? "Modifica slot" : "Aggiungi una fascia oraria"}</h2>
        <p className="helper-text">
          La fascia verrà divisa automaticamente in slot consecutivi da un’ora.
        </p>
        <form className="inline-form" onSubmit={submit}>
          <label>
            Inizio
            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(event) => setStartTime(event.target.value)}
              required
            />
          </label>
          <label>
            Fine
            <input
              type="datetime-local"
              value={form.endTime}
              onChange={(event) =>
                setForm({ ...form, endTime: event.target.value })
              }
              required
            />
          </label>
          <button className="button" disabled={!tutorId || !form.endTime}>
            {editingId ? "Salva" : "Aggiungi"}
          </button>
        </form>
        {message && <p className="form-message success">{message}</p>}
      </section>
      <section className="panel">
        <div className="section-heading">
          <h2>Slot pubblicati</h2>
          <span>{slots.length} ore</span>
        </div>
        {slots.length ? (
          <div className="slot-list">
            {slots.map((slot) => (
              <div className="slot-row" key={slot._id}>
                <span>
                  {new Date(slot.startTime).toLocaleString("it-IT", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}{" "}
                  –{" "}
                  {new Date(slot.endTime).toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  <small>(1 ora)</small>
                </span>
                <span>
                  {slot.isBooked ? (
                    "Prenotato"
                  ) : (
                    <span className="row-actions">
                      <button
                        className="text-link"
                        type="button"
                        onClick={() => edit(slot)}
                      >
                        Modifica
                      </button>
                      <button
                        className="danger-link"
                        type="button"
                        onClick={() => remove(slot._id)}
                      >
                        Elimina
                      </button>
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">
            Aggiungi il primo orario in cui vuoi insegnare.
          </p>
        )}
      </section>
    </div>
  );
};
