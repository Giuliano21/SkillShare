// userApi.js gestisce le chiamate API per le operazioni relative agli utenti, come il recupero e l'aggiornamento del profilo.
import {http} from './http';

export const getProfile = () => http('/users/profile');

export const updateProfile = (data) => http('/users/profile', {
    method: 'PUT',
    body: data
});

export const deleteProfile = () => http('/users/profile', {
    method: 'DELETE',
});