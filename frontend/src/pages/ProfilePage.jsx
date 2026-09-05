import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteProfile, getProfile, updateProfile } from '../api/userApi';
import { getMyTutor, updateMyTutor } from '../api/tutorApi';
import { useAuth } from '../context/useAuth';

export const ProfilePage = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({ name: '', surname: '', username: '', email: '' });
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
    const [tutorForm, setTutorForm] = useState({ subjects: '', hourlyPrice: '', bio: '', lessonMode: 'remote' });
    const [showPasswords, setShowPasswords] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const roles = Array.isArray(user?.role) ? user.role : [user?.role];
    const isTutor = roles.includes('tutor');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await getProfile();
                setProfile(data.user);
                setFormData({ name: data.user.name || '', surname: data.user.surname || '', username: data.user.username || '', email: data.user.email || '' });
                if (isTutor) {
                    const tutorData = await getMyTutor();
                    setTutorForm({ subjects: tutorData.tutor.subjects?.join(', ') || '', hourlyPrice: tutorData.tutor.hourlyPrice || '', bio: tutorData.tutor.bio || '', lessonMode: tutorData.tutor.lessonMode || 'remote' });
                }
            } catch (err) { setError(err.message); }
        };
        loadProfile();
    }, [isTutor]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!window.confirm('Confermi il salvataggio delle modifiche al profilo?')) return;
        setError('');
        setMessage('');
        try {
            const body = { ...formData };
            if (passwords.newPassword) Object.assign(body, passwords);
            const data = await updateProfile(body);
            if (isTutor) await updateMyTutor({ ...tutorForm, subjects: tutorForm.subjects.split(',').map((subject) => subject.trim()).filter(Boolean) });
            setProfile(data.user);
            setPasswords({ currentPassword: '', newPassword: '' });
            setMessage(data.message);
        } catch (err) { setError(err.message); }
    };

    const handleDelete = async () => {
        if (!window.confirm('Sei sicuro di voler eliminare il tuo account?')) return;
        await deleteProfile();
        await logout();
        navigate('/');
    };

    if (!profile) return <div className="content-page"><p className="empty-state">{error || 'Caricamento profilo...'}</p></div>;
    const passwordType = showPasswords ? 'text' : 'password';

    return <div className="content-page narrow-page"><div className="page-heading"><div><p className="eyebrow">Il tuo spazio</p><h1>Profilo.</h1></div></div>{message && <p className="form-message success">{message}</p>}{error && <p className="form-message error">{error}</p>}<form className="panel profile-form" onSubmit={handleSubmit}><div className="form-grid"><label>Nome<input name="name" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} /></label><label>Cognome<input name="surname" value={formData.surname} onChange={(event) => setFormData({ ...formData, surname: event.target.value })} /></label></div><label>Username<input name="username" value={formData.username} onChange={(event) => setFormData({ ...formData, username: event.target.value })} /></label><label>Email<input name="email" type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} /></label>{isTutor && <div className="tutor-fields"><div className="form-divider"><h2>Profilo tutor</h2><p>Queste informazioni compaiono nella ricerca.</p></div><label>Materie, separate da virgola<input value={tutorForm.subjects} onChange={(event) => setTutorForm({ ...tutorForm, subjects: event.target.value })} /></label><div className="form-grid"><label>Prezzo orario<input type="number" min="0" value={tutorForm.hourlyPrice} onChange={(event) => setTutorForm({ ...tutorForm, hourlyPrice: event.target.value })} /></label><label>Modalità<select value={tutorForm.lessonMode} onChange={(event) => setTutorForm({ ...tutorForm, lessonMode: event.target.value })}><option value="remote">Remoto</option><option value="presence">In presenza</option></select></label></div><label>Bio<textarea value={tutorForm.bio} onChange={(event) => setTutorForm({ ...tutorForm, bio: event.target.value })} /></label></div>}<div className="form-divider"><h2>Cambia password</h2><p>Lascia vuoto se non vuoi modificare le credenziali.</p></div><div className="form-grid"><label>Password attuale<input name="currentPassword" type={passwordType} value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} /></label><label>Nuova password<input name="newPassword" type={passwordType} value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} /></label></div><label className="password-toggle"><input type="checkbox" checked={showPasswords} onChange={(event) => setShowPasswords(event.target.checked)} /> Mostra password</label><button className="button" type="submit">Salva modifiche</button></form><button className="danger-link" onClick={handleDelete}>Elimina account</button></div>;
};
