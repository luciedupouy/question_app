import React from 'react';
import { Link } from 'react-router-dom';
import '../css/question.css';

const FormSelection = ({ userId }) => {
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
                    <button className='loginButton'>
                    <Link className="lien" to={`/questions/Form1/${userId}`}>Questionnaire 1</Link>
                </button>
                <button className='loginButton'>
                    <Link className="lien" to={`/questions/Form2/${userId}`}>Questionnaire 2</Link>
                </button>
            </div>
            <div className='termine'>
                <button className='loginButton'>
                    <Link className="lien" to={`/long-answer`}>Terminer</Link>
                </button>
            </div>
        </div>
    </div>
    
  );
};

export default FormSelection;
