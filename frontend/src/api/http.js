const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let accesToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
}

export const getAccessToken = () => accessToken;

export const http = async (endpoint, options = {}) => {
    const {method = 'GET',body, ...rest} = options;

    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
        ...rest,
    });

    if (!response.ok){
        const error = await response.json();
        throw new Error(error.message || "Errore API");
    }

    return response.json();
};