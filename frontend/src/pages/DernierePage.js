import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../css/question.css';
import ConfirmationModal from '../components/pop'; 

function LongAnswerPage({ userId, resetUserId}) {
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [actionType, setActionType] = useState('');
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/get_long_answer_question');
                setQuestion(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération de la question:', error);
                setMessage('Erreur lors du chargement de la question');
            }
        };

        fetchQuestion();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalMessage("Êtes-vous sûr de vouloir soumettre votre réponse ?");
        setActionType('submit');
        setShowModal(true);
    };

    const handleConfirmSubmit = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/submit_long_answer', {
                id: userId,
                field_name: question.field_name,
                answer: answer
            });
            setMessage('Réponse soumise avec succès');
            resetUserId();
            navigate('/'); // Redirection vers la page de connexion
        } catch (error) {
            console.error('Erreur lors de la soumission de la réponse:', error);
            setMessage('Erreur lors de la soumission de la réponse');
        }
        setShowModal(false);
    };

    const handleLogoutClick = (e) => {
        e.preventDefault();
        setModalMessage("Êtes-vous sûr de vouloir vous déconnecter ?");
        setActionType('logout');
        setShowModal(true);
    };

    const handleConfirmLogout = () => {
        resetUserId();
        navigate('/'); // Redirection vers la page de connexion
        
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    if (!question) return <div>Chargement de la question...</div>;

    return (
        <div>
            <div className="centre">
                <h1>Merci pour tes réponses ! Tu as terminé.</h1>
                <h2>{question.field_label}</h2>
                <form onSubmit={handleSubmit}>
                    <textarea 
                        className='textarea'
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        rows="10"
                        cols="50"
                        placeholder='Commentaires'
                    />
                    <br />
                    <button className='loginButton' type="submit">Envoyer</button>
                </form>
                {message && <p>{message}</p>}
            </div>
            <div>
                <a href='/' onClick={handleLogoutClick}>Se déconnecter</a>
            </div>
            <ConfirmationModal
                show={showModal}
                message={modalMessage}
                onConfirm={actionType === 'submit' ? handleConfirmSubmit : handleConfirmLogout}
                onCancel={handleCancel}
            />
        </div>
    );
}

export default LongAnswerPage;
