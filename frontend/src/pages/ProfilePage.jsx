import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { getProfile, updateProfile, deleteProfile } from "../api/userApi";
import {useAuth} from "../context/AuthContext";

export const ProfilePage = () => {
    const [profile, setProfile] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        username: '',
        email: ''
    });
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: ''
    });
    const [message, setmessage] = useState('');
    const [error, setError] = useState('');

    const {logout} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadProfile = async () =>{
            const data = await getProfile();
            setProfile(data.user);
            setFormData({
                name: data.user.name,
                surname: data.user.surname,
                username: data.user.username,
                email: data.user.email
            });
        };
        loadProfile();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handlePasswordChange = (e) => {
        const {name, value} = e.target;
        setPasswords((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError('');
        setMessage('');
        try{
            const body = {...formData};
            if(passwords.newPassword){
                body.currentPassword = passwords.currentPassword;
                body.newPassword = passwords.newPassword;
            }
            const data = await updateProfile(body);
            setProfile(data.user);
            setMessage(data.message);
            setPasswords({currentPassword: '', newPassword: ''});
        } catch (err){
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        if(!confirm('Sei sicuro di voler elimminare il tuo account?')) return;
        await deleteProfile();
        await logout();
        navigate('/');
    };
// Loader per il caricamento del profilo, prima che i dati siano disponibili
    if(!profile) return <p>Caricamento...</p>;

    return(
        <div>
            <h2>Il Mio Profilo</h2>
            {message && <p style={{color: 'green'}}>{message}</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input name="name" type="text" placeholder="Nome" value={formData.name} onChange={handleChange}/>
                <input name="surname" type="text" placeholder="Cognome" value={formData.surname} onChange={handleChange}/>
                <input name="username" type="text" placeholder="Username" value={formData.username} onChange={handleChange}/>
                <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange}/>

                <h3>Cambia Password</h3>
                <input 
                name="currentPassword"
                type="password"
                placeholder="Password Attuale"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                />
                <input
                name="newPassword"
                type="password"
                placeholder="Nuova Password"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                />

                <button type="submit">Salva Modifiche</button>
            </form>

            <button onClick={handleDelete} style={{color: 'red'}}>Elimina Account</button>
        </div>
    );
};