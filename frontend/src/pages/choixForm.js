import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnswersContext } from '../components/AnswersContext';
import { useLanguage } from '../components/LangContext'; // Importez le contexte de langue
import axios from 'axios';
import ConfirmationModal from '../components/pop'; 
import { translationsFormSelection } from '../translations/translationChoix'; // Importez les traductions spécifiques à FormSelection
import '../css/question.css';

const FormSelection = ({ userId, resetUserId }) => {
  const { answers, completedForms } = useContext(AnswersContext);
  const { language } = useLanguage(); // Utilisez le contexte de langue
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(null);

  const texts = translationsFormSelection[language]; // Obtenez les textes pour la page FormSelection

  const getFormNames = () => {
    if (language === 'fr') {
      return ['Form1', 'Form2'];
    } else {
      return ['Form1E', 'Form2E'];
    }
  };

  const handleSaveAndContinueLater = () => {
    setModalMessage(texts.saveAndContinueLater);
    setModalAction(() => saveAndContinueLater);
    setShowModal(true);
  };

  const handleFinish = () => {
    setModalMessage(texts.finish);
    setModalAction(() => finishForm);
    setShowModal(true);
  };

  const saveAndContinueLater = async () => {
    try {
      const validFieldsResponse = await axios.get('https://backend-flax-theta.vercel.app/get_valid_fields');
      const validFields = validFieldsResponse.data.map(field => field.original_field_name);

      const validAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
        if (validFields.includes(key) && value !== "") {
          acc[key] = Array.isArray(value) ? value.join(',') : value;
        }
        return acc;
      }, {});

      console.log("Données envoyées :", { id: userId, ...validAnswers });

      const response = await axios.post('https://backend-flax-theta.vercel.app/update', {
        id: userId,
        ...validAnswers
      });
      console.log("Réponse du serveur :", response.data);
      setMessage('Toutes les réponses ont été enregistrées avec succès');
      resetUserId();
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
    setShowModal(false);
  };

  const finishForm = async () => {
    try {
      const validFieldsResponse = await axios.get('https://backend-flax-theta.vercel.app//get_valid_fields');
      const validFields = validFieldsResponse.data.map(field => field.original_field_name);

      const validAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
        if (validFields.includes(key) && value !== "") {
          acc[key] = Array.isArray(value) ? value.join(',') : value;
        }
        return acc;
      }, {});

      console.log("Données envoyées :", { id: userId, ...validAnswers });

      const response = await axios.post('https://backend-flax-theta.vercel.app//update', {
        id: userId,
        ...validAnswers
      });
      console.log("Réponse du serveur :", response.data);
      setMessage('Formulaire terminé et enregistré avec succès');
      navigate('/long-answer');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des réponses:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      setMessage('Erreur lors de l\'enregistrement des réponses');
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className='nav'>
        <div></div>
        <div>
          <button><Link className='nodeco' to={`/tuto`}>Tuto</Link></button>
        </div>
      </div>
      <div className="centre">
        <h2>{texts.chooseForm}</h2>
        <div>
          {getFormNames().map((formName, index) => (
            <button key={formName} className='element_list'>
              <Link className='nodeco' to={`/questions/${formName}/${userId}`}>
                <div className='espace'>
                  <div>
                    {texts.formLabel} {index + 1}
                  </div>
                  <div>
                    {completedForms[formName] && <span> {texts.finishedForm}</span>}
                  </div>
                </div>
              </Link>
            </button>
          ))}
          <div className='termine'>
            <button className='loginButton' onClick={handleFinish}>{texts.finish}</button>
          </div>
        </div>
      </div>
      <div>
        <a href='/' onClick={(e) => {
          e.preventDefault();
          handleSaveAndContinueLater();
        }}>{texts.saveAndContinueLater}</a>
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
};

export default FormSelection;
