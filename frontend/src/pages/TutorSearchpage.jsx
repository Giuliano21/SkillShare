import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTutors } from '../api/tutorApi';
import { Filterbar } from '../components/Filterbar';

export const TutorSearchpage = () => {
    const [tutors, setTutors] = useState([]);
    const [filters, setFilters] = useState({subject: '', minPrice: '', maxPrice: '', lessonMode:''});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const search = async () => {
        setError('');
        try{
        setLoading(true);
        // Rimuovo i filtri vuoti per evitare di inviare parametri non necessari
            const cleaned = Object.fromEntries(
                Object.entries(filters).filter(([,v]) => v != '')
            );
            const data = await getAllTutors(cleaned);
            setTutors(data.tutors || []);
        }catch (err){
            setError(err.message);
        } finally { setLoading(false); }
    };

    useEffect(() => {
        const timer = setTimeout(async () => {
            setError('');
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
        const {name, value} = e.target;
        setFilters((prev) => ({...prev, [name]: value}));
    };

    return <div className="content-page"><div className="page-heading"><div><p className="eyebrow">Trova il tuo prossimo punto di vista</p><h1>Cerca un tutor.</h1></div><span className="result-count">{tutors.length} risultati</span></div><Filterbar filters={filters} onChange={handleChange} onSearch={search} />{error && <p className="form-message error">{error}</p>}{loading ? <p className="empty-state">Cerco le persone giuste per te...</p> : tutors.length ? <div className="tutor-grid">{tutors.map((tutor) => <Link className="tutor-card" key={tutor._id || tutor.id} to={`/tutors/${tutor._id || tutor.id}`}><div className="avatar">{tutor.userId?.name?.[0] || '?'}</div><div><div className="card-top"><h3>{tutor.userId?.name} {tutor.userId?.surname}</h3><span>{tutor.rating || '—'} ★</span></div><p>{tutor.subjects?.join(' · ')}</p><div className="card-meta"><span>{tutor.lessonMode === 'in-person' ? 'In presenza' : 'Remoto'}</span><strong>{tutor.hourlyPrice} €/h</strong></div></div></Link>)}</div> : <p className="empty-state">Nessun tutor corrisponde ai filtri scelti.</p>}</div>;
};

export { TutorSearchpage as TutorSearchPage };