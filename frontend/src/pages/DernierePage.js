import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LongAnswerPage({ userId }) {
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [message, setMessage] = useState('');

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
        try {
            await axios.post('http://127.0.0.1:5000/submit_long_answer', {
                id: userId,
                field_name: question.field_name,
                answer: answer
            });
            setMessage('Réponse soumise avec succès');
        } catch (error) {
            console.error('Erreur lors de la soumission de la réponse:', error);
            setMessage('Erreur lors de la soumission de la réponse');
        }
    };

    if (!question) return <div>Chargement de la question...</div>;

    return (
        <div>
            <h1>Merci pour tes réponses ! Tu as terminé.</h1>
            <h2>{question.field_label}</h2>
            <form onSubmit={handleSubmit}>
                <textarea 
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows="10"
                    cols="50"
                    placeholder='Commentaires'
                />
                <br />
                <button type="submit">Envoyer</button>
            </form>
            {message && <p>{message}</p>}
            <a href='/'>Se déconnecter</a>
        </div>
    );
}

export default LongAnswerPage;