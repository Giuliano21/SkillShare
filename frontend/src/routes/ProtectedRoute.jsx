import {Navigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

export const ProtectedRoute = ({children, allowedRoles = null }) => {
    const {user, isAuthenticated, loading} = useAuth();

// Mentre determiniamo lo stato di autenticazione
    if (loading) {
        return <div>Caricamento...</div>;
    }
// Check se l'utente è autenticato
    if (!isAuthenticated){
        return <Navigate to='/login' replace />;
    }

// Check se l'utente è autorizzato in base al ruolo
    if(allowedRoles && !allowedRoles.includes(user.role)){
        return <Navigate to="/authorized" replace />;

    }

    return children;
};