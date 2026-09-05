import { useEffect, useState } from 'react';
import { cancelBooking, getMyBookings, updateBookingStatus } from '../api/bookingApi';
import { useAuth } from '../context/useAuth';

export const BookingsPage = () => {
  const { user } = useAuth();
  const roles = Array.isArray(user?.role) ? user.role : [user?.role];
  const isTutor = roles.includes('tutor');
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const load = async () => { const data = await getMyBookings(); setBookings(data.bookings || []); };
  useEffect(() => { const timer = setTimeout(() => { load().catch((error) => setMessage(error.message)); }, 0); return () => clearTimeout(timer); }, []);
  const cancel = async (id) => { try { await cancelBooking(id); setMessage('Prenotazione cancellata.'); await load(); } catch (error) { setMessage(error.message); } };
  const update = async (id, status) => { try { await updateBookingStatus(id, { status }); setMessage('Stato aggiornato.'); await load(); } catch (error) { setMessage(error.message); } };
  return <div className="content-page narrow-page"><div className="page-heading"><div><p className="eyebrow">Il tuo percorso</p><h1>{isTutor ? 'Lezioni da seguire.' : 'Le tue lezioni.'}</h1></div></div>{message && <p className="form-message success">{message}</p>}<div className="booking-list">{bookings.length ? bookings.map((booking) => { const student = `${booking.userId?.name || booking.userId?.username || 'Studente'} ${booking.userId?.surname || ''}`.trim(); const tutor = `${booking.tutorId?.userId?.name || ''} ${booking.tutorId?.userId?.surname || ''}`.trim() || 'Tutor'; const start = booking.slotId?.startTime ? new Date(booking.slotId.startTime) : null; const end = booking.slotIds?.length ? new Date(booking.slotIds[booking.slotIds.length - 1].endTime) : booking.slotId?.endTime ? new Date(booking.slotId.endTime) : null; return <article className="booking-row" key={booking._id}><div><span className={`status status-${booking.status}`}>{booking.status}</span><h3>{booking.subject || 'Lezione'}</h3><p><strong>Studente:</strong> {student}</p><p><strong>Tutor:</strong> {tutor}</p><p>{start ? `${start.toLocaleDateString('it-IT', { dateStyle: 'medium' })} ${start.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}–${end ? end.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : ''} · ${booking.slotIds?.length || 1} ${(booking.slotIds?.length || 1) === 1 ? 'ora' : 'ore'}` : 'Orario da definire'}</p></div><div className="row-actions">{isTutor && booking.status === 'pending' && <button className="button button-small" onClick={() => update(booking._id, 'accepted')}>Accetta</button>}{isTutor && booking.status === 'accepted' && <button className="button button-small" onClick={() => update(booking._id, 'completed')}>Completa</button>}{!isTutor && booking.status !== 'cancelled' && <button className="button button-ghost button-small" onClick={() => cancel(booking._id)}>Annulla</button>}</div></article>; }) : <p className="empty-state">Non ci sono ancora prenotazioni.</p>}</div></div>;
};
