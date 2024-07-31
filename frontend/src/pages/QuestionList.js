import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AnswersContext } from '../components/AnswersContext';
import axios from 'axios';
import '../css/question.css';
import Navbar from '../components/NavBar';

function QuestionList() {
    const { formName, userId } = useParams();
    const { answers, setCompletedForms } = useContext(AnswersContext);
    const [questions, setQuestions] = useState([]);
    const [validFields, setValidFields] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [questionsResponse, fieldsResponse] = await Promise.all([
                    axios.get(`http://localhost:5000/get_questions/${formName}`),
                    axios.get('http://localhost:5000/get_valid_fields')
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
            setMessage('Toutes les réponses ont été enregistrées avec succès');

            // Marque le formulaire comme complété
            setCompletedForms(prev => ({
                ...prev,
                [formName]: true
            }));

            // Redirection vers la page d'identification
            navigate('/continuer');
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement des réponses:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
            setMessage('Erreur lors de l\'enregistrement des réponses');
        }
    };

    return (
        <div>
            <Navbar></Navbar>
            <div className="centre">
                <h2>Liste des Questions</h2>
                <button className='loginButton'>
                    <Link className="lien" to={`/question/${formName}/${userId}/0`}>Commencer à répondre</Link>
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
            <div className='marge'>
                <a href='/' onClick={handleSaveAndContinueLater}>Continuer plus tard</a>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
}

export default QuestionList;
