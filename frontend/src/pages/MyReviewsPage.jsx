import { useEffect, useState } from 'react';
import { getMyReviews, updateReview, deleteReview } from '../api/reviewApi';

export const MyReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ rating: 5, comment: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const load = async () => {
        const data = await getMyReviews();
        setReviews(data.reviews || []);
    };

    useEffect(() => {
        const timer = setTimeout(() => load().catch((err) => setError(err.message)), 0);
        return () => clearTimeout(timer);
    }, []);

    const save = async (event) => {
        event.preventDefault();
        try {
            await updateReview(editing._id, form);
            setEditing(null);
            setMessage('Recensione aggiornata.');
            await load();
        } catch (err) { setError(err.message); }
    };

    const remove = async (id) => {
        if (!window.confirm('Vuoi eliminare questa recensione?')) return;
        try {
            await deleteReview(id);
            setReviews((current) => current.filter((review) => review._id !== id));
            setMessage('Recensione eliminata.');
        } catch (err) { setError(err.message); }
    };

    return <div className="content-page narrow-page"><div className="page-heading"><div><p className="eyebrow">La tua voce</p><h1>Le mie recensioni.</h1></div><span className="result-count">{reviews.length} recensioni</span></div>{message && <p className="form-message success">{message}</p>}{error && <p className="form-message error">{error}</p>}{editing && <form className="panel review-form" onSubmit={save}><h2>Modifica recensione</h2><label>Valutazione<select value={form.rating} onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })}><option value="5">5 stelle</option><option value="4">4 stelle</option><option value="3">3 stelle</option><option value="2">2 stelle</option><option value="1">1 stella</option></select></label><label>Commento<textarea value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} maxLength="200" required /></label><div className="row-actions"><button className="button" type="submit">Salva</button><button className="button button-ghost" type="button" onClick={() => setEditing(null)}>Annulla</button></div></form>}<div className="my-review-list">{reviews.length ? reviews.map((review) => <article className="panel my-review" key={review._id}><div className="section-heading"><div><p className="eyebrow">Tutor</p><h2>{review.tutorId?.userId?.name} {review.tutorId?.userId?.surname}</h2></div><strong className="review-stars">{'★'.repeat(review.rating)}</strong></div><p>{review.comment}</p><small>{review.bookingId?.subject || 'Lezione'}</small><div className="row-actions"><button className="text-link" onClick={() => { setEditing(review); setForm({ rating: review.rating, comment: review.comment || '' }); }}>Modifica</button><button className="danger-link" onClick={() => remove(review._id)}>Elimina</button></div></article>) : <p className="empty-state">Non hai ancora scritto recensioni.</p>}</div></div>;
};
