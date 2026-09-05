export const Filterbar = ({ filters, onChange, onSearch }) => <form className="filterbar" onSubmit={(event) => { event.preventDefault(); onSearch(); }}>
	<label>Materia<input name="subject" value={filters.subject} onChange={onChange} placeholder="es. Matematica" /></label>
	<label>Prezzo minimo<input name="minPrice" type="number" min="0" value={filters.minPrice} onChange={onChange} placeholder="€/ora" /></label>
	<label>Prezzo massimo<input name="maxPrice" type="number" min="0" value={filters.maxPrice} onChange={onChange} placeholder="€/ora" /></label>
	<label>Modalità<select name="lessonMode" value={filters.lessonMode} onChange={onChange}><option value="">Tutte</option><option value="remote">Remoto</option><option value="presence">In presenza</option></select></label>
	<button className="button" type="submit">Cerca tutor</button>
</form>;
