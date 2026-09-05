import {Navigate} from 'react-router-dom';
import {useAuth} from '../context/useAuth';

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
    const roles = Array.isArray(user?.role) ? user.role : [user?.role];
    if(allowedRoles && !allowedRoles.some((role) => roles.includes(role))){
        return <Navigate to="/unauthorized" replace />;

    }

    return children;
};