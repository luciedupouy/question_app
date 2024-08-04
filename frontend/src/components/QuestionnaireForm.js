import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import { AnswersContext } from './AnswersContext';
import ConfirmationModal from './pop';
import { useLanguage } from './LangContext'; // Assurez-vous d'importer le contexte de langue
import { translationsQuestionPage } from '../translations/translationQuestion'; // Importez les traductions spécifiques

function QuestionPage({ userId, resetUserId }) {
  const { answers, setAnswers, completedForms, setCompletedForms } = useContext(AnswersContext);
  const { formName, questionIndex } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage(); // Utilisez le contexte de langue
  const [questions, setQuestions] = useState([]);
  const [validFields, setValidFields] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(parseInt(questionIndex, 10) || 0);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsResponse, fieldsResponse] = await Promise.all([
          axios.get(`http://127.0.0.1:5000/get_questions/${formName}?`),
          axios.get('http://127.0.0.1:5000/get_valid_fields')
        ]);
        setQuestions(questionsResponse.data);
        setValidFields(fieldsResponse.data.map(field => field.original_field_name));
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage(translationsQuestionPage[language].loadingQuestions);
      }
    };

    fetchData();
  }, [formName, language]);

  useEffect(() => {
    if (completedForms[formName]) {
      console.log(`Formulaire ${formName} déjà complété.`);
    }
  }, [formName, completedForms]);

  useEffect(() => {
    setCurrentQuestionIndex(parseInt(questionIndex, 10) || 0);
  }, [questionIndex]);

  const handleAnswerChange = (fieldName, value) => {
    setAnswers(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSaveAndContinueLater = () => {
    setModalMessage(translationsQuestionPage[language].continueLaterMessage);
    setModalAction(() => saveAndContinueLater);
    setShowModal(true);
  };

  const handleFinish = () => {
    setModalMessage(translationsQuestionPage[language].finishFormMessage);
    setModalAction(() => finishForm);
    setShowModal(true);
  };

  const saveAndContinueLater = async () => {
    try {
      const validAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
        if (validFields.includes(key) && value !== "") {
          acc[key] = Array.isArray(value) ? value.join(',') : value;
        }
        return acc;
      }, {});

      console.log("Données envoyées :", { id: userId, ...validAnswers });

      const response = await axios.post('http://127.0.0.1:5000/update', {
        id: userId,
        ...validAnswers
      });
      console.log("Réponse du serveur :", response.data);
      setMessage('Toutes les réponses ont été enregistrées avec succès');

      setCompletedForms(prev => ({
        ...prev,
        [formName]: true
      }));
      resetUserId();
      navigate('/continuer');
    } catch (error) {
      console.error('Error submitting answers:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      setMessage(translationsQuestionPage[language].loadingQuestions);
    }
    setShowModal(false);
  };

  const finishForm = async () => {
    try {
      const validAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
        if (validFields.includes(key) && value !== "") {
          acc[key] = Array.isArray(value) ? value.join(',') : value;
        }
        return acc;
      }, {});

      console.log("Données envoyées :", { id: userId, ...validAnswers });

      const response = await axios.post('http://127.0.0.1:5000/update', {
        id: userId,
        ...validAnswers
      });
      console.log("Réponse du serveur :", response.data);
      setMessage('Formulaire terminé et enregistré avec succès');

      setCompletedForms(prev => ({
        ...prev,
        [formName]: true
      }));
      navigate('/form-selection');
    } catch (error) {
      console.error('Error submitting answers:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      setMessage(translationsQuestionPage[language].loadingQuestions);
    }
    setShowModal(false);
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      navigate(`/question/${formName}/${userId}/${currentQuestionIndex + 1}`);
    } else {
      handleFinish(); // Affiche le modal pour la confirmation
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      navigate(`/question/${formName}/${userId}/${currentQuestionIndex - 1}`);
    }
  };

  const renderQuestionInput = (question) => {
    if (question.field_type === 'radio' || question.field_type === 'dropdown') {
      const choices = question.select_choices_or_calculations.split('|').map(choice => {
        const [value, label] = choice.split(',').map(s => s.trim());
        return { value, label };
      });

      return (
        <div>
          {choices.map(choice => (
            <label key={choice.value}>
              <input
                type="radio"
                name={question.field_name}
                value={choice.value}
                checked={answers[question.field_name] === choice.value}
                onChange={(e) => handleAnswerChange(question.field_name, e.target.value)}
              />
              {choice.label}
            </label>
          ))}
        </div>
      );
    } else if (question.field_type === 'checkbox') {
      const choices = question.select_choices_or_calculations.split('|').map(choice => {
        const [value, label] = choice.split(',').map(s => s.trim());
        return { value, label };
      });

      return (
        <div>
          {choices.map(choice => (
            <label key={choice.value}>
              <input
                type="checkbox"
                value={choice.value}
                checked={answers[question.field_name]?.includes(choice.value) || false}
                onChange={(e) => {
                  const currentAnswers = answers[question.field_name] || [];
                  let newAnswers;
                  if (e.target.checked) {
                    newAnswers = [...currentAnswers, choice.value];
                  } else {
                    newAnswers = currentAnswers.filter(v => v !== choice.value);
                  }
                  handleAnswerChange(question.field_name, newAnswers.join(','));
                }}
              />
              {choice.label}
            </label>
          ))}
        </div>
      );
    } else {
      return (
        <input 
          type="text" 
          value={answers[question.field_name] || ''}
          onChange={(e) => handleAnswerChange(question.field_name, e.target.value)}
        />
      );
    }
  };

  if (questions.length === 0) return <div>{translationsQuestionPage[language].loadingQuestions}</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div>
      <Navbar />
      <div className="centre">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <p> {currentQuestionIndex + 1} / {questions.length}</p>
        <h2>{currentQuestion.field_label}</h2>
        <div className='reponse'>
          {renderQuestionInput(currentQuestion)}
        </div>
        <div className='doubleBouton'>
          <button className='pButton' onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            {translationsQuestionPage[language].previousQuestion}
          </button>
          <button className='sButton' onClick={handleNext}>
            {currentQuestionIndex === questions.length - 1 ? translationsQuestionPage[language].finish : translationsQuestionPage[language].nextQuestion}
          </button>
        </div>
        <div>
          <a href='/' onClick={(e) => {
            e.preventDefault();
            handleSaveAndContinueLater();
          }}>{translationsQuestionPage[language].continueLater}</a>
        </div>
        {message && <p>{message}</p>}
        <ConfirmationModal
          show={showModal}
          message={modalMessage}
          onConfirm={modalAction}
          onCancel={() => setShowModal(false)}
        />
      </div>
    </div>
  );
}

export default QuestionPage;
