import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AnswersContext } from '../components/AnswersContext';
import '../css/question.css'


function QuestionList({ questions, userId }) {
    const { answers } = useContext(AnswersContext);

    // Filtrer les questions pour exclure la question à longue réponse
    const mainQuestions = questions.filter(q => q.field_type !== 'notes');

    return (
        <div>
            <div className='nav'>
                <div></div>
                <div>
                <button >Tuto</button>
                </div>
            </div>

            <div class="centre">
            <h2>Liste des Questions</h2>
            <button className='loginButton'><Link className="lien" to={`/question/${userId}/0`}>Commencer à répondre</Link></button>
                {mainQuestions.map((question, index) => (
                <div  className='element_list' key={question.field_name}>
                    <Link className='nodeco' to={`/question/${userId}/${index}`}>
                        <div className='espace'>
                            <div>                            
                                Question {index + 1}
                            </div>
                            <div>
                            {answers[question.field_name] && " ✔️"}
                            </div>
                        </div>
                    </Link>
                </div>
                ))}
            
            
            </div> 
            <div className='marge'>
            <a href='/'>Continuer plus tard</a>
            </div>    
        </div>
    );
}

export default QuestionList;