import {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

export const LoginPage = () =>{
// Ogni campo avrà il suo stato locale per gestire l'input dell'utente
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const {login, loading} = useAuth();
// Per indirizzare l'utente dopo il login
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    // Impedisce di ricaricare la pagina al submit del form
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        }catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {/* Disabilita il pulsante di submit se il login è in corso */}
            <button type="submit" disabled={loading}>
                {loading ? 'Caricamento...' : 'Accedi'}
            </button>
            <p>Non hai un account? <Link to="/register">Registrati</Link></p>
        </form>
    );
}