import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {getTutorById, getTutorAvailability} from "../api/tutorApi";

export const TutorDetailPage = () => {
    const {id} = useParams();
    const [tutor, setTutor] = useState('');
    const [slot, setSlot] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try{
                const tutorData = await  getTutorById(id);
                const slotData = await getTutorAvailability(id);
                setTutor(tutorData.tutor);
                setSlot(slotData.slots);
            }catch (err){
                setError(err.message);
            }
        };
        load();
    }, [id]);

    if (error) return <p style={{color: 'red'}}>{error}</p>;
    if (!tutor) return <p>Caricamento...</p>;

    return (
        <div>
            <h2>{tutor.userId?.name} {tutor.userId?.surname}</h2>
            <p>{tutor.bio}</p>
            <p>Materie: {tutor.subjects?.join(', ')}</p>
            <p>Prezzo: {tutor.hourlyPrice}</p>
            <p>Modalità: {tutor.lessonMode}</p>

            <h3>Slot Disponibili</h3>
            <ul>
                {slot.map((slot) => (
                    <li key={slot.id}>
                        {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};