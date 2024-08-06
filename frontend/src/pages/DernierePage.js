import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../components/LangContext'; // Importez le contexte de langue
import { translationsLongAnswerPage } from '../translations/translationDernier'; // Importez les traductions spécifiques à LongAnswerPage
import '../css/question.css';
import ConfirmationModal from '../components/pop'; 

function LongAnswerPage({ userId, resetUserId }) {
    const { language } = useLanguage(); // Utilisez le contexte de langue
    const texts = translationsLongAnswerPage[language]; // Obtenez les textes pour la page LongAnswerPage
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
                const response = await axios.get(' https://backend-qy7g4owzg-luciedupouys-projects.vercel.app/get_long_answer_question');
                setQuestion(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération de la question:', error);
                setMessage(texts.fetchError);
            }
        };

        fetchQuestion();
    }, [texts.fetchError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalMessage(texts.submitConfirmation);
        setActionType('submit');
        setShowModal(true);
    };

    const handleConfirmSubmit = async () => {
        try {
            await axios.post(' https://backend-qy7g4owzg-luciedupouys-projects.vercel.app/submit_long_answer', {
                id: userId,
                field_name: question.field_name,
                answer: answer
            });
            setMessage(texts.submitSuccess);
            resetUserId();
            navigate('/'); // Redirection vers la page de connexion
        } catch (error) {
            console.error('Erreur lors de la soumission de la réponse:', error);
            setMessage(texts.submitError);
        }
        setShowModal(false);
    };

    const handleLogoutClick = (e) => {
        e.preventDefault();
        setModalMessage(texts.logoutConfirmation);
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

    if (!question) return <div>{texts.loadingQuestion}</div>;

    return (
        <div>
            <div className="centre">
                <h1>{texts.thankYou}</h1>
                <h2>{texts.question}</h2>
                <form onSubmit={handleSubmit}>
                    <textarea 
                        className='textarea'
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        rows="10"
                        cols="50"
                        placeholder={texts.placeholder}
                    />
                    <br />
                    <button className='loginButton' type="submit">{texts.submit}</button>
                </form>
                {message && <p>{message}</p>}
            </div>
            <div>
                <a href='/' onClick={handleLogoutClick}>{texts.logout}</a>
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
