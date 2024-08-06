import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AnswersContext } from '../components/AnswersContext';
import axios from 'axios';
import '../css/question.css';
import Navbar from '../components/NavBar';
import ConfirmationModal from '../components/pop'; // Assurez-vous du bon chemin vers le fichier
import { useLanguage } from '../components/LangContext'; // Importez le contexte de langue
import { translationsQuestionList } from '../translations/translationList'; // Importez les traductions spécifiques à QuestionList

function QuestionList({ resetUserId }) {
    const { formName, userId } = useParams();
    const { answers, setCompletedForms } = useContext(AnswersContext);
    const { language } = useLanguage(); // Utilisez le contexte de langue
    const texts = translationsQuestionList[language]; // Obtenez les textes pour la page QuestionList
    const [questions, setQuestions] = useState([]);
    const [validFields, setValidFields] = useState([]);
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [questionsResponse, fieldsResponse] = await Promise.all([
                    axios.get(` https://backend-qy7g4owzg-luciedupouys-projects.vercel.app/get_questions/${formName}?`),
                    axios.get(' https://backend-qy7g4owzg-luciedupouys-projects.vercel.app/get_valid_fields')
                ]);
                setQuestions(questionsResponse.data);
                setValidFields(fieldsResponse.data.map(field => field.original_field_name));
            } catch (error) {
                console.error("Il y a eu une erreur lors de la récupération des données !", error);
            }
        };

        fetchData();
    }, [formName]);

    const mainQuestions = questions.filter(q => q.field_type !== 'notes');

    const handleSaveAndContinueLater = async () => {
        try {
            const validAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
                if (validFields.includes(key) && value !== "") {
                    acc[key] = Array.isArray(value) ? value.join(',') : value;
                }
                return acc;
            }, {});

            console.log("Données envoyées :", { id: userId, ...validAnswers });

            const response = await axios.post('http://localhost:5000/update', {
                id: userId,
                ...validAnswers
            });
            console.log("Réponse du serveur :", response.data);
            setMessage(texts.saveSuccess);

            // Marque le formulaire comme complété
            setCompletedForms(prev => ({
                ...prev,
                [formName]: true
            }));
            resetUserId();

            // Redirection vers la page d'identification
            navigate('/continuer');
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement des réponses:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
            setMessage(texts.saveError);
        }
    };

    const openConfirmationModal = (message, action) => {
        setModalMessage(message);
        setModalAction(() => action);
        setShowModal(true);
    };

    const handleContinueLater = (e) => {
        e.preventDefault();
        openConfirmationModal(texts.continueLaterConfirmation, handleSaveAndContinueLater);
    };

    return (
        <div>
            <Navbar />
            <div className="centre2">
                <h2>{texts.title}</h2>
                <button className='loginButton'>
                    <Link className="lien" to={`/question/${formName}/${userId}/0`}>{texts.startButton}</Link>
                </button>
                {mainQuestions.map((question, index) => (
                    <div className='element_list' key={question.field_name}>
                        <Link className='nodeco' to={`/question/${formName}/${userId}/${index}`}>
                            <div className='espace'>
                                <div>
                                    Question {index + 1}
                                </div>
                                <div>
                                    {answers[question.field_name] && " ✔️"}
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <div>
                <a className="marge" href='/' onClick={handleContinueLater}>{texts.continueLater}</a>
            </div>
            {message && <p>{message}</p>}
            <ConfirmationModal
                show={showModal}
                message={modalMessage}
                onConfirm={modalAction}
                onCancel={() => setShowModal(false)}
            />
        </div>
    );
}

export default QuestionList;
