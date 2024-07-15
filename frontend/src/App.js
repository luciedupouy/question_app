import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import QuestionList from './pages/QuestionList';
import QuestionPage from './components/QuestionnaireForm';
import DernierePage from './pages/DernierePage';
import Tuto from './pages/Tuto';
import { AnswersProvider } from './components/AnswersContext';

function App() {
  const [userId, setUserId] = useState(null);
  const [questions, setQuestions] = useState([]);

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
      <AnswersProvider>
        <Routes>
          <Route path="/" element={
            userId ? <Navigate to="/tuto" /> : <Login onSuccessfulLogin={setUserId} />
          } />
          <Route path="/tuto" element={
            userId ? <Tuto questions={questions} userId={userId} /> : <Navigate to="/" />
          } />
          <Route path="/questions" element={
            userId ? <QuestionList questions={questions} userId={userId} /> : <Navigate to="/" />
          } />
          <Route path="/question/:userId/:questionIndex" element={
            userId ? <QuestionPage userId={userId} questions={questions} /> : <Navigate to="/" />
          } />
          <Route path="/long-answer" element={
            userId ? <DernierePage userId={userId} /> : <Navigate to="/" />
          } />
        </Routes>
      </AnswersProvider>
    </Router>
  );
}

export default App;