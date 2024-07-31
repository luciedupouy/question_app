import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AnswersContext } from '../components/AnswersContext';
import '../css/question.css';

const FormSelection = ({ userId }) => {
  const { completedForms } = useContext(AnswersContext);

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
            <div>
                <a href='/'>Continuer plus tard</a>
            </div>  
    </div>
  );
};

export default FormSelection;
