/* bookingApi.js gestisce le chiamate API per le operazioni relative alle prenotazioni, come la creazione,
l'annullamento e l'aggiornamento dello stato delle prenotazioni. */
import { http } from './http';
    
export const createBooking = (data) => http('/bookings', {
    method: 'POST',
    body: data
});

export const getMyBookings = () => http('/bookings/my-bookings');

export const cancelBooking = (id) => http(`/bookings/${id}/cancel`, {
    method: 'PATCH'
});

export const updateBookingStatus = (id, data) => http(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: data
});
