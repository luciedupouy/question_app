import React from 'react';

const LanguageSelector = ({ language, setLanguage }) => {
  const handleLanguageChange = (lang) => {
    setLanguage(lang); // Met à jour l'état de la langue dans le composant parent
  };

  return (
    <div>
      <button onClick={() => handleLanguageChange('fr')} disabled={language === 'fr'}>
        Français
      </button>
      <button onClick={() => handleLanguageChange('en')} disabled={language === 'en'}>
        English
      </button>
    </div>
  );
};

export default LanguageSelector;
