import {http} from './http';

export const getProfile = () => http('/users/profile');

// Aggiornamento del profilo, solo i dati passati vengono aggiornati-altri invariati
export const updateProfile = (data) => http('/users/profile', {
    method: 'PUT',
    body: data
});

export const deleteProfile = () => http('/users/profile', {
    method: 'DELETE',
});