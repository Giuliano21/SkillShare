import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const LoginPage = () =>{
// Ogni campo avrà il suo stato locale per gestire l'input dell'utente
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

    return <div className="auth-layout"><div className="auth-aside"><p className="eyebrow">Bentornato</p><h1>Il prossimo passo<br /><em>parte da qui.</em></h1><p>Riprendi il filo delle tue lezioni e continua a costruire qualcosa di tuo.</p></div><form className="form-card" onSubmit={handleSubmit}><p className="eyebrow">Accedi a SkillShare</p><h2>Entra nel tuo spazio</h2>{error && <p className="form-message error">{error}</p>}<label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><label>Password<input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required /></label><label className="password-toggle"><input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} /> Mostra password</label><button className="button full" type="submit" disabled={loading}>{loading ? 'Accesso in corso...' : 'Accedi'}</button><p className="form-footer">Non hai un account? <Link to="/register">Registrati</Link></p></form></div>;
}