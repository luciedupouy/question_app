import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AnswersContext } from '../components/AnswersContext';
import { useLanguage } from '../components/LangContext';
import { translations } from '../translations/translationLogin'; // Importez les traductions
import '../css/question.css';
import LanguageSelector from '../components/LangageSelector';

function Login({ onSuccessfulLogin }) {
    const { resetAnswers, resetCompletedForms } = useContext(AnswersContext);
    const { language } = useLanguage(); // Utilisez le contexte de langue
    const [nom, setNom] = useState('');
    const [prNom, setPrNom] = useState('');
    const [mail, setMail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        resetAnswers(); 
        resetCompletedForms();
        event.preventDefault();
        try {
<<<<<<< HEAD
            const response = await axios.post('https://backend-flax-theta.vercel.app//submit', {
=======
            const response = await axios.post(' https://backend-pntjk8nqq-luciedupouys-projects.vercel.app//submit', {
>>>>>>> 85ba27393373d5e683434cf10e03d1864982cde0
                nom,
                pr_nom: prNom,
                mail
            });
            console.log('Data submitted successfully:', response.data);
            onSuccessfulLogin(response.data.id);  
            navigate('/tuto');  
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

    const texts = translations[language]; // Obtenez les textes en fonction de la langue

    return (
        <div className='noscroll'>
            <LanguageSelector />
            <div className="centre">
                <h1>{texts.welcome}</h1>
                <h2>{texts.signIn}</h2>
                <p>{texts.enterEmail}</p>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input 
                            className='input' 
                            type="text" 
                            value={nom} 
                            onChange={(e) => setNom(e.target.value)} 
                            placeholder={texts.lastNamePlaceholder} 
                            required 
                        />
                    </div>
                    <div>
                        <input 
                            className='input' 
                            type="text" 
                            value={prNom} 
                            onChange={(e) => setPrNom(e.target.value)} 
                            placeholder={texts.firstNamePlaceholder} 
                            required 
                        />
                    </div>
                    <div>
                        <input 
                            className='input' 
                            type="email" 
                            value={mail} 
                            onChange={(e) => setMail(e.target.value)} 
                            placeholder={texts.emailPlaceholder} 
                            required 
                        />
                    </div>
                    <button className='loginButton' type="submit">{texts.signInButton}</button>
                </form>
            </div>
            <a href='/continuer'>{texts.continueLink}</a>
        </div>
    );
}

export default Login;
