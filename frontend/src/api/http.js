const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const http = async (endpoint, options = {}) => {
    const {method = 'GET', body, ...rest} = options;

    const headers = {
        'Content-Type': 'application/json',
        ...rest.headers,
    };

    const token = localStorage.getItem('token');
    if (token){
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        ...rest,
    });

    if (!response.ok){
        const error = await response.json();
        throw new Error(error.message || 'Errore API');
    }
    
    return response.json();
};