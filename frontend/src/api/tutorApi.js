import {http} from "./http";

export const getAllTutors = (filters= {}) =>{
// Query per la ricerca tutor con filtri opzionli
    const params = new URLSearchParams(filters).toString();
    return http(`/tutors?${params ? `&${params}` : ''}`);
};

export const getTutorById = (id) => http(`/tutors/${id}`);

export const getTutorAvailability = (id) => http(`/tutors/${id}/availability`);

export const addtutorAvailability = (id, data) => http(`/tutors/${id}/availability`, {
    method: 'POST',
    body: data
});

export const updateTutorAvailability = (id, data) => http(`/tutors/${id}/availability`, {
    method: 'PUT',
    body: data
});
