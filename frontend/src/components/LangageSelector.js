import React from 'react';

const LanguageSelector = ({ language, setLanguage }) => {
    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        console.log("Language changed to:", lang); // Ajoutez ce log pour déboguer
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
