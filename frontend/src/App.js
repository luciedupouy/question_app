import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import QuestionList from './pages/QuestionList';
import QuestionPage from './components/QuestionnaireForm';
import DernierePage from './pages/DernierePage';
import Tuto from './pages/Tuto';
import FormSelect from './pages/choixForm';
import { AnswersProvider } from './components/AnswersContext';

function App() {
    const [userId, setUserId] = useState(null);

    return (
        <Router>
            <AnswersProvider>
                <Routes>
                    <Route path="/" element={
                        userId ? <Navigate to="/tuto" /> : <Login onSuccessfulLogin={setUserId} />
                    } />
                    <Route path="/tuto" element={
                        userId ? <Tuto userId={userId} /> : <Navigate to="/" />
                    } />
                    <Route path="/form-selection" element={
                        userId ? <FormSelect userId={userId} /> : <Navigate to="/" />
                    } />
                    <Route path="/questions/:formName/:userId" element={
                        userId ? <QuestionList /> : <Navigate to="/" />
                    } />
                    <Route path="/question/:formName/:userId/:questionIndex" element={
                        userId ? <QuestionPage userId={userId} /> : <Navigate to="/" />
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
