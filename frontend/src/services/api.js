import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Assurez-vous que cela correspond à l'URL de votre backend
});

export const submitQuestionnaire = async (data) => {
  try {
    const response = await api.post('/submit', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting questionnaire:', error);
    throw error;
  }
};
