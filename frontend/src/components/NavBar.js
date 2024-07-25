import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/navbar.css'

const Navbar = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/form-selection');
  };

  return (
    <nav >
      <button onClick={handleBack} >
        Retour
      </button>
      <button >
        <Link to={`/tuto/`}>
        Tuto
        </Link>
      </button>
    </nav>
  );
};

export default Navbar;
