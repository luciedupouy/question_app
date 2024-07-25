import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnswersContext } from '../components/AnswersContext';
import axios from 'axios';
import '../css/question.css';
import Navbar from '../components/NavBar';

function QuestionList() {
    const { formName, userId } = useParams();
    const { answers } = useContext(AnswersContext);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/get_questions/${formName}`)
            .then(response => setQuestions(response.data))
            .catch(error => console.error("Il y a eu une erreur lors de la récupération des questions !", error));
    }, [formName]);

    const mainQuestions = questions.filter(q => q.field_type !== 'notes');

    return (
        <div>
            <Navbar></Navbar>
            <div className="centre">
                <h2>Liste des Questions</h2>
                <button className='loginButton'>
                    <Link className="lien" to={`/question/${formName}/${userId}/0`}>Commencer à répondre</Link>
                </button>
                {mainQuestions.map((question, index) => (
                    <div className='element_list' key={question.field_name}>
                        <Link className='nodeco' to={`/question/${formName}/${userId}/${index}`}>
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
