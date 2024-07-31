import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnswersContext } from '../components/AnswersContext';
import axios from 'axios';
import '../css/question.css';

const FormSelection = ({ userId }) => {
  const { answers, completedForms } = useContext(AnswersContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleSaveAndContinueLater = async () => {
    try {
      const validFieldsResponse = await axios.get('http://localhost:5000/get_valid_fields');
      const validFields = validFieldsResponse.data.map(field => field.original_field_name);

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
      <div className='nav'>
        <div></div>
        <div>
          <button>Tuto</button>
        </div>
      </div>
      <div className="centre">
        <h2>Choisissez un formulaire</h2>
        <div>
          <button className='element_list'>
            <Link className='nodeco' to={`/questions/Form1/${userId}`}>
              <div className='espace'>
                <div>
                  Questionnaire 1
                </div>
                <div>
                  {completedForms.Form1 && <span> ✔️</span>}
                </div>
              </div>
            </Link>
          </button>
          <button className='element_list'>
            <Link className='nodeco' to={`/questions/Form2/${userId}`}>
              <div className='espace'>
                <div>
                  Questionnaire 2
                </div>
                <div>
                  {completedForms.Form2 && <span> ✔️</span>}
                </div>
              </div>
            </Link>
          </button>
          <div className='termine'>
            <button className='loginButton'>
              <Link className="lien" to={`/long-answer`}>Terminer</Link>
            </button>
          </div>
        </div>
      </div>
      <div >
        <a href='/' onClick={handleSaveAndContinueLater}>Continuer plus tard</a>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FormSelection;
