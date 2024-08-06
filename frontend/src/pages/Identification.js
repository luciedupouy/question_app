import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AnswersContext } from '../components/AnswersContext';
import { useLanguage } from '../components/LangContext'; // Importez le contexte de langue
import { translationsId } from '../translations/translationId'; // Importez les traductions spécifiques à Identification
import '../css/question.css';
import LanguageSelector from '../components/LangageSelector';

function Identification({ onSuccessfulIdentification }) {
  const { resetAnswers, resetCompletedForms, setAnswers } = useContext(AnswersContext);
  const { language } = useLanguage(); // Utilisez le contexte de langue
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetAnswers();
    resetCompletedForms();
    setError('');
  
    try {
      console.log('Sending data:', { email, id });
      const checkResponse = await axios.post('https://backend-flax-theta.vercel.app//check_identity', { email, id });
      
      if (checkResponse.status === 200) {
        console.log('Identity verified, fetching answers');
        try {
          const answersResponse = await axios.get(`https://backend-flax-theta.vercel.app//get_answers/${id}`);
          console.log('Answers received:', answersResponse.data);
          if (Object.keys(answersResponse.data).length > 0) {
            setAnswers(answersResponse.data);
            console.log('Answers set in context');
          } else {
            console.log('No previous answers found');
          }
          onSuccessfulIdentification(id);
        } catch (answerError) {
          console.error('Error fetching answers:', answerError);
          if (answerError.response && answerError.response.status === 404) {
            console.log('No previous answers found (404 response)');
          } else {
            setError('Error fetching previous answers');
          }
        }
      }
    } catch (err) {
      console.error('Full error object:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(err.response.data.error || 'An error occurred while verifying identity');
      } else if (err.request) {
        console.error('Error request:', err.request);
        setError('Unable to contact the server. Check your internet connection.');
      } else {
        console.error('Error message:', err.message);
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const texts = translationsId[language]; // Obtenez les textes pour la page Identification

  return (
    <div className='noscroll'>
      <LanguageSelector />
      <div className="centre">
        <h1>{texts.welcomeBack}</h1>
        <h2>{texts.signIn}</h2>
        <p>{texts.enterId}</p>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              className='input'
              type="email"
              placeholder={texts.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              className='input'
              type="number"
              placeholder={texts.idPlaceholder}
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button className='loginButton' type="submit">{texts.signInButton}</button>
        </form>
      </div>
      <a href='/'>{texts.createAccountLink}</a>
    </div>
  );
}

export default Identification;
