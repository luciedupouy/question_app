import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AnswersContext } from '../components/AnswersContext';
import '../css/question.css';

function Identification({ onSuccessfulIdentification }) {
  const { resetAnswers, resetCompletedForms, setAnswers } = useContext(AnswersContext);
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
      const checkResponse = await axios.post('http://127.0.0.1:5000/check_identity', { email, id });
      
      if (checkResponse.status === 200) {
        // Récupérer les réponses
        const answersResponse = await axios.get(`http://127.0.0.1:5000/get_answers/${id}`);
        setAnswers(answersResponse.data);
        onSuccessfulIdentification(id); // Signaler l'identification réussie
      }
    } catch (err) {
      console.error('Full error object:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(err.response.data.error || 'Une erreur s\'est produite lors de la vérification de l\'identité');
      } else if (err.request) {
        console.error('Error request:', err.request);
        setError('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
      } else {
        console.error('Error message:', err.message);
        setError('Une erreur inattendue s\'est produite. Veuillez réessayer.');
      }
    }
  };

  return (
    <div className='noscroll'>
      <div className="centre">
        <h1>Tu es de retour !</h1>
        <h2>S'identifier</h2>
        <p>Entre ton identifiant pour te connecter</p>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Identifiant"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button className='loginButton' type="submit">S'identifier avec un email</button>
        </form>
      </div>
      <a href='/continuer'>Continuer de répondre au questionnaire</a>
    </div>
  );
}

export default Identification;