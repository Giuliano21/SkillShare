import {createContext, useState, useContext, useEffect} from 'react';
import {http} from '../api/http';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);

// Verifico se il token presente è valido al caricamento del componente
    useEffect(() => {
        if (token) {
            const getUser = async () => {
                try{
                    const data = await http('/users/profile');
                    setUser(data.user);
                }catch(err){
                    console.error('Token scaduto:', err);
                    logout();
                }
            };
            getUser();
        }
    }, [token]);

    const register  =async (formData) => {
        setLoading(true);
        try{
            const data = await http('/users/register', {
                method: 'POST',
                body: formData,
            });

            if (data.token){
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setUser(data.user);
            }
            return data;
        }finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try{
            const data = await http('/users/login', {
                method: 'POST',
                body: {email, password},
            });
            localStorage.setItem('token',data.token);
            setToken(data.token);
            setUser(data.user);
            return data;
        } finally{
            setLoading(false);
        }
    };

    const logout = async () => {
        try{
            await http('/users/logout', {
                method: 'POST',
            });  
        }catch(err){
            console.error('Logout fallito:', err);
        }finally{
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    };

// value letti dai components
    const value = {
        user,
        token,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!token,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth deve essere usato all interno di un AuthProvider');
    return context;

};



