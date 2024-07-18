import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AnswersContext } from '../components/AnswersContext';
import '../css/question.css'


function Login({ onSuccessfulLogin }) {
    const { resetAnswers } = useContext(AnswersContext);
    const [nom, setNom] = useState('');
    const [prNom, setPrNom] = useState('');
    const [mail, setMail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        resetAnswers(); 
        event.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/submit', {
                nom,
                pr_nom: prNom,
                mail
            });
            console.log('Data submitted successfully:', response.data);
            onSuccessfulLogin(response.data.id);  // Passer l'ID à App.js
            navigate('/tuto');  // Rediriger vers la page des questions
            // Réinitialiser les champs après une soumission réussie
            setNom('');
            setPrNom('');
            setMail('');
        } catch (error) {
            if (error.response) {
                console.error('Server Error:', error.response.status);
                console.error('Server Response:', error.response.data);
            } else if (error.request) {
                console.error('No Response:', error.request);
            } else {
                console.error('Error:', error.message);
            }
            console.error('Error Config:', error.config);
        }
    };

    return (
        <div className='noscroll'>
            <div class="centre">
                <h1>Bienvenue !</h1>
                <h2>S'identifier</h2>
                <p>Entrez un email pour répondre au questionnaire</p>
                <form onSubmit={handleSubmit}>
                <div>
                    <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder='Nom'/>
                </div>
                <div>
                    <input type="text" value={prNom} onChange={(e) => setPrNom(e.target.value)} placeholder='Prénom'/>
                </div>
                <div>
                    <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} placeholder='email@domain.com'/>
                </div>
                <button className='loginButton' type="submit">S'identifier avec un email</button>
                </form>
            </div>
            <a href=''>Continuer de répondre au questionnaire</a>
        </div>
      
        
    );
}

export default Login;