import React from 'react';
import { Link } from 'react-router-dom';
import '../css/question.css';

const FormSelection = ({ userId }) => {
  return (
    <div className="centre">
      <h2>Choisissez un formulaire</h2>
      <button className='loginButton'>
        <Link className="lien" to={`/questions/Form1/${userId}`}>Questionnaire 1</Link>
      </button>
      <button className='loginButton'>
        <Link className="lien" to={`/questions/Form2/${userId}`}>Questionnaire 2</Link>
      </button>
    </div>
  );
};

export default FormSelection;
