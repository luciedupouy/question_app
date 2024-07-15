import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AnswersContext } from '../components/AnswersContext';


function QuestionList({ questions, userId }) {
    const { answers } = useContext(AnswersContext);

    // Filtrer les questions pour exclure la question à longue réponse
    const mainQuestions = questions.filter(q => q.field_type !== 'notes');

    return (
        <div>
            <button>Tuto</button>
            <h2>Liste des Questions</h2>
            <ul>
                {mainQuestions.map((question, index) => (
                <li key={question.field_name}>
                    <Link to={`/question/${userId}/${index}`}>
                    Question {index + 1}
                    {answers[question.field_name] && " ✅"}
                    </Link>
                </li>
                ))}
            </ul>
            <button><Link to={`/question/${userId}/0`}>Commencer à répondre</Link></button>
            <a href='/'>Continuer plus tard</a>
        </div>
    );
}

export default QuestionList;