import React, { useState } from 'react';
import { submitQuestionnaire } from '../services/api';

const QuestionnaireForm = () => {
  const [formData, setFormData] = useState({ question1: '', question2: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await submitQuestionnaire(formData);
      console.log('Questionnaire submitted successfully:', response);
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Question 1:</label>
        <input
          type="text"
          name="question1"
          value={formData.question1}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Question 2:</label>
        <input
          type="text"
          name="question2"
          value={formData.question2}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default QuestionnaireForm;
