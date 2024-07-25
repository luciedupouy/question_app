import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../css/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const path = location.pathname;

    if (path.startsWith('/question/')) {
      // Si l'utilisateur est sur une question spécifique
      const parts = path.split('/');
      const formName = parts[2];
      const userId = parts[3];
      navigate(`/questions/${formName}/${userId}`);
    } else if (path.startsWith('/questions/')) {
      // Si l'utilisateur est sur la liste des questions
      navigate('/form-selection');
    } else {
      // Sinon, par défaut, renvoyer à la page de sélection du formulaire
      navigate('/form-selection');
    }
  };

  return (
    <nav>
      <button onClick={handleBack}>
        Retour
      </button>
      <button>
        <Link to="/tuto">
          Tuto
        </Link>
      </button>
    </nav>
  );
};

export default Navbar;
