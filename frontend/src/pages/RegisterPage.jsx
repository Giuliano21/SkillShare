import {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {http} from "../api/http";

export const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name : '',
        surname : '',
        username: '',
        email : '',
        password : '',
        role : 'student',
        subjects : '',
        hourlyPrice: '',
        bio: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value}= e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const body = { ...formData};
            if (body.role ==='tutor'){
                body.subjects = body.subjects.split(',').map((s)=> s.trim());
            } else {
                delete body.subjects;
                delete body.hourlyPrice;
                delete body.bio;
            }
            await http('/auth/register', {method:'POST', body});
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Registrazione</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <input name="name" type="text" placeholder="Nome" value={formData.name} onChange={handleChange} required />
            <input name="surname" type="text" placeholder="Cognome" value={formData.surname} onChange={handleChange} required />
            <input name="username" type="text" placeholder="Username" value={formData.username} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

            <select name="role" value={formData.role} onChange={handleChange}>
                <option value="student">Studente</option>
                <option value="tutor">Tutor</option>
            </select>

            {formData.role === 'tutor' && (
                <>
                    <input name="subjects" type="text" placeholder="Materie (separate da virgola)" value={formData.subjects} onChange={handleChange} required />
                    <input name="hourlyPrice" type="number" placeholder="Prezzo orario" value={formData.hourlyPrice} onChange={handleChange} required />
                    <textarea name="bio" placeholder="Biografia" value={formData.bio} onChange={handleChange} required />
                 </>
            )}

            <button type="submit" disabled={loading}>
                {loading ? 'Attendere...':'Registrati'}
            </button>
            <p> Hai già un account? <Link to= "/login">Accedi</Link></p>
        </form>
    );
};