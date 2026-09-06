// reviewApi.js gestisce le chiamate API per le operazioni relative alle recensioni dei tutor, come la creazione, l'aggiornamento, la cancellazione e il recupero delle recensioni.
import { http } from "./http";

export const getReviews = (tutorId) => http(`/reviews/${tutorId}`);
export const getMyReviews = () => http("/reviews/me");

export const createReview = (data) =>
  http("/reviews", {
    method: "POST",
    body: data,
  });

export const updateReview = (id, data) =>
  http(`/reviews/${id}`, {
    method: "PUT",
    body: data,
  });

export const deleteReview = (id) =>
  http(`/reviews/${id}`, {
    method: "DELETE",
  });
