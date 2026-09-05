import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filterbar } from '../components/Filterbar';
import { getAllTutors } from '../api/tutorApi';
import { useAuth } from '../context/useAuth';
import { TutorDashboardPage } from './TutorDashboardPage';

const TutorCard = ({ tutor }) => <Link className="tutor-card" to={`/tutors/${tutor._id}`}><div className="avatar">{tutor.userId?.name?.[0] || '?'}</div><div><div className="card-top"><h3>{tutor.userId?.name} {tutor.userId?.surname}</h3><span>{Number(tutor.rating || 0).toFixed(1)} ★</span></div><p>{tutor.subjects?.join(' · ') || 'Materie non indicate'}</p><div className="card-meta"><span>{tutor.lessonMode === 'presence' ? 'In presenza' : 'Remoto'}</span><strong>{tutor.hourlyPrice} €/h</strong></div></div></Link>;

export const HomePage = () => {
    const { user } = useAuth();
    const roles = Array.isArray(user?.role) ? user.role : [user?.role];
    const [filters, setFilters] = useState({ subject: '', minPrice: '', maxPrice: '', lessonMode: '' });
    const [bestTutors, setBestTutors] = useState([]);
    const [newTutors, setNewTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadTutors = useCallback(async (nextFilters) => {
        setLoading(true);
        setError('');
        const cleaned = Object.fromEntries(Object.entries(nextFilters).filter(([, value]) => value !== ''));
        try {
            const [best, newest] = await Promise.all([
                getAllTutors({ ...cleaned, sort: 'rating' }),
                getAllTutors({ ...cleaned, sort: 'newest' }),
            ]);
            setBestTutors((best.tutors || []).slice(0, 4));
            setNewTutors((newest.tutors || []).slice(0, 4));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => loadTutors({}), 0);
        return () => clearTimeout(timer);
    }, [loadTutors]);

    if (roles.includes('tutor')) return <TutorDashboardPage />;

    return <div className="home-page home-search-page">
        <section className="home-search-hero"><div><p className="eyebrow">SkillShare · Impara da persone reali</p><h1>Trova il tutor giusto per il tuo prossimo passo.</h1><p className="hero-text">Confronta esperienza, recensioni e prezzi. Poi scegli quando iniziare.</p></div></section>
        <main className="home-search-main">
            <Filterbar filters={filters} onChange={(event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }))} onSearch={() => loadTutors(filters)} />
            {error && <p className="form-message error">{error}</p>}
            {loading ? <p className="empty-state">Sto cercando i tutor migliori per te...</p> : <div className="tutor-rails"><section className="tutor-rail"><div className="section-heading"><div><p className="eyebrow">Le scelte della community</p><h2>Migliori per recensioni.</h2></div><span>Top 4</span></div>{bestTutors.length ? <div className="tutor-grid">{bestTutors.map((tutor) => <TutorCard key={tutor._id} tutor={tutor} />)}</div> : <p className="empty-state">Nessun tutor corrisponde ai filtri.</p>}</section><section className="tutor-rail"><div className="section-heading"><div><p className="eyebrow">Nuove prospettive</p><h2>Tutor appena arrivati.</h2></div><span>Nuovi</span></div>{newTutors.length ? <div className="tutor-grid">{newTutors.map((tutor) => <TutorCard key={tutor._id} tutor={tutor} />)}</div> : <p className="empty-state">Nessun nuovo tutor disponibile.</p>}</section></div>}
            <div className="home-all-tutors"><Link className="button" to="/tutors/search">Mostra tutti i tutor <span>↗</span></Link></div>
        </main>
        <section className="home-info"><div><p className="eyebrow">Come funziona</p><h2>Una scelta più umana per imparare.</h2></div><div className="info-points"><article><strong>01</strong><h3>Confronta</h3><p>Filtra per materia, prezzo e modalità per trovare profili adatti al tuo obiettivo.</p></article><article><strong>02</strong><h3>Prenota</h3><p>Scegli uno o più slot consecutivi e costruisci una lezione della durata che ti serve.</p></article><article><strong>03</strong><h3>Cresci</h3><p>Impara con continuità, parla con il tutor e lascia una recensione dopo la lezione.</p></article></div></section>
    </div>;
};
