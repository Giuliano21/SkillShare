import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {getAllTutors} from "../api/tutorApi";

export const TutorSearchpage = () => {
    const [tutors, setTutors] = useState([]);
    const [filters, setFilters] = useState({subject: '', maxPrice:'', lessonMode:''});
    const [error, setError] = useState('');

    const search = async () => {
        setError('');
        try{
        // Rimuovo i filtri vuoti per evitare di inviare parametri non necessari
            const cleaned = Object.fromEntries(
                Object.entries(filters).filter(([,v]) => v != '')
            );
            const data = await getAllTutors(cleaned);
            setTutors(data.tutors);
        }catch (err){
            setError(err.message);
        }
    };
// Carico tutti i tutor senza filtri iniziali
    useEffect(() => {search(); }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFilters((prev) => ({...prev, [name]: value}));
    };

    return(
        <div>
            <h2>Cerca Tutor</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}

            <input name="subject" placeholder="Materia" value={filters.subject} onChange={handleChange} />
            <input name="maxPrice" placeholder="Prezzo massimo" value={filters.maxPrice} onChange={handleChange} />
            <select name="lessonMode" value={filters.lessonMode} onChange={handleChange}>
                <option value="">Tutte le modalità</option>
                <option value="remote">Remoto</option>
                <option value="in-person">In presenza</option>
            </select>
            <button onClick={search}>Cerca</button>

            <ul>
                {tutors.map((t) => (
                    <li key={t.id}>
                        <Link to={`/tutors/${t.id}`}>
                            {t.userId?.name} {t.userId?.surname} - {t.subjects.join(', ')}- {t.hourlyPrice}€/h
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};