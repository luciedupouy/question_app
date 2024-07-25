import React, { createContext, useState, useEffect } from 'react';

export const AnswersContext = createContext();

export const AnswersProvider = ({ children }) => {
  const [answers, setAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem('answers');
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  const [completedForms, setCompletedForms] = useState(() => {
    const savedCompletedForms = localStorage.getItem('completedForms');
    return savedCompletedForms ? JSON.parse(savedCompletedForms) : {};
  });

  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('completedForms', JSON.stringify(completedForms));
  }, [completedForms]);

  const resetAnswers = () => {
    setAnswers({});
    localStorage.removeItem('answers');
  };

  const resetCompletedForms = () => {
    setCompletedForms({});
    localStorage.removeItem('completedForms');
  };

  return (
    <AnswersContext.Provider value={{ answers, setAnswers, completedForms, setCompletedForms, resetAnswers, resetCompletedForms }}>
      {children}
    </AnswersContext.Provider>
  );
};
