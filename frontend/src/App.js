import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import QuestionPage from './components/QuestionnaireForm';  // Nouveau composant à créer

function App() {
  const [userId, setUserId] = useState(null);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            userId ? (
              <Navigate to="/question" replace />
            ) : (
              <Login onSuccessfulLogin={(id) => setUserId(id)} />
            )
          } 
        />
        <Route 
          path="/question" 
          element={
            userId ? (
              <QuestionPage userId={userId} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;