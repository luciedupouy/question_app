import React from 'react';
import { Link } from 'react-router-dom';

function QuestionList({ questions, answers, userId }) {
    // Filtrer les questions pour exclure la question à longue réponse
    const mainQuestions = questions.filter(q => q.field_type !== 'notes');

    return (
        <div>
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
        </div>
    );
}

export default QuestionList;