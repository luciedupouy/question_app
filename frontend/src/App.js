import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import QuestionList from './pages/QuestionList';
import QuestionPage from './components/QuestionnaireForm';
import DernierePage from './pages/DernierePage'
import Tuto from './pages/Tuto'

function App() {
    const [userId, setUserId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        // Charger les questions
        if (userId) {
            axios.get('http://127.0.0.1:5000/get_questions')
                .then(response => setQuestions(response.data))
                .catch(error => console.error('Error fetching questions:', error));
        }
    }, [userId]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    userId ? <Navigate to="/questions" /> : <Login onSuccessfulLogin={setUserId} />
                } />
                <Route path="/tuto" element={
                    userId ? <Tuto questions={questions} answers={answers} userId={userId} /> : <Navigate to="/" />
                } />
                <Route path="/questions" element={
                    userId ? <QuestionList questions={questions} answers={answers} userId={userId} /> : <Navigate to="/" />
                } />
                <Route path="/question/:userId/:questionIndex" element={
                      <QuestionPage
                        userId={userId}
                        questions={questions}
                        answers={answers}
                        setAnswers={setAnswers}
                      />
                    } 
                  />
                  <Route path="/long-answer" element={<DernierePage userId={userId} />} />
            </Routes>
        </Router>
    );
}

export default App;