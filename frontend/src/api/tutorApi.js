/* tutorApi.js gestisce le chiamate API per le operazioni relative ai tutor, come la ricerca,
il recupero dei dettagli e la gestione della disponibilità. */
import {http} from "./http";

export const getAllTutors = (filters= {}) =>{
// Query per la ricerca tutor con filtri opzionli
    const params = new URLSearchParams(filters).toString();
    return http(`/tutors?${params ? `&${params}` : ''}`);
};

export const getTutorById = (id) => http(`/tutors/${id}`);

export const getMyTutor = () => http('/tutors/me');
export const updateMyTutor = (data) => http('/tutors/me', { method: 'PUT', body: data });

export const getTutorAvailability = (id) => http(`/tutors/${id}/availability`);

export const addtutorAvailability = (id, data) => http(`/tutors/${id}/availability`, {
    method: 'POST',
    body: data
});

export const updateTutorAvailability = (id, data) => http(`/tutors/${id}/availability`, {
    method: 'PUT',
    body: data
});

export const deleteTutorAvailability = (id) => http(`/tutors/availability/${id}`, { method: 'DELETE' });
