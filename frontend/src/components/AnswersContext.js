// AnswersContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AnswersContext = createContext();

export const AnswersProvider = ({ children }) => {
  const [answers, setAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem('answers');
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);

  const resetAnswers = () => {
    setAnswers({});
    localStorage.removeItem('answers');
  };

  return (
    <AnswersContext.Provider value={{ answers, setAnswers, resetAnswers }}>
      {children}
    </AnswersContext.Provider>
  );
};