import React from 'react';
import '../css/question.css';
import { useLanguage } from '../components/LangContext'; // Importez le contexte de langue
import { translationsConfirmationModal } from '../translations/translationPop'; // Importez les traductions spécifiques au modal

const ConfirmationModal = ({ show, message, onConfirm, onCancel }) => {
  const { language } = useLanguage(); // Utilisez le contexte de langue
  const texts = translationsConfirmationModal[language]; // Obtenez les textes pour le modal

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <p>{message}</p>
        <div className="doubleBouton">
          <button className='pButton' onClick={onCancel}>{texts.cancelButton}</button>
          <button className="sButton" onClick={onConfirm}>{texts.confirmButton}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
