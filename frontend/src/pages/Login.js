import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [nom, setNom] = useState('');
  const [prNom, setPrNom] = useState('');
  const [mail, setMail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post(' http://127.0.0.1:5000/submit', {
        nom: '2',
        pr_nom: 'lucie',
        mail: 'lucie@gmail.com'
      });
  
      console.log('Data submitted successfully:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Server Error:', error.response.status);
        console.error('Server Response:', error.response.data);
      } else if (error.request) {
        console.error('No Response:', error.request);
      } else {
        console.error('Error:', error.message);
      }
      console.error('Error Config:', error.config);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nom:</label>
        <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
      </div>
      <div>
        <label>Prénom:</label>
        <input type="text" value={prNom} onChange={(e) => setPrNom(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default Login;


