import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import QuestionList from './pages/QuestionList';
import QuestionPage from './components/QuestionnaireForm';
import DernierePage from './pages/DernierePage';
import Tuto from './pages/Tuto';
import FormSelect from './pages/choixForm';
import Identification from "./pages/Identification";
import { AnswersProvider } from './components/AnswersContext';

function App() {
    const [userId, setUserId] = useState(null);

    return (
        <Router>
            <AnswersProvider>
                <Routes>
                    <Route path="/" element={
                        userId ? <Navigate to="/tuto" replace /> : <Login onSuccessfulLogin={setUserId} />
                    } />
                    <Route path="/continuer" element={
                        userId ? <Navigate to="/form-selection" replace /> : <Identification onSuccessfulIdentification={setUserId} />
                    } />
                    <Route path="/tuto" element={
                        userId ? <Tuto userId={userId} /> : <Navigate to="/" replace />
                    } />
                    <Route path="/form-selection" element={
                        userId ? <FormSelect userId={userId} /> : <Navigate to="/" replace />
                    } />
                    <Route path="/questions/:formName/:userId" element={
                        userId ? <QuestionList userId={userId} /> : <Navigate to="/" replace />
                    } />
                    <Route path="/question/:formName/:userId/:questionIndex" element={
                        userId ? <QuestionPage userId={userId} /> : <Navigate to="/" replace />
                    } />
                    <Route path="/long-answer" element={
                        userId ? <DernierePage userId={userId} /> : <Navigate to="/" replace />
                    } />
                </Routes>
            </AnswersProvider>
        </Router>
    );
}

export default App;
