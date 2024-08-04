import React from 'react';
import { useLanguage } from '../components/LangContext'; // Assurez-vous que le chemin d'importation est correct
import '../css/question.css'

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage(); // Utilisez le contexte de langue

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <div className="language-selector">
      <button
        className="languageButton"
        onClick={toggleLanguage}
      >
        {language === 'fr' ? 'Switch to English' : 'Passer au Français'}
      </button>
    </div>
  );
};

export default LanguageSelector;
