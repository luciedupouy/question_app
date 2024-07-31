import React from 'react';
import '../css/question.css';

const ConfirmationModal = ({ show, message, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
        <button className='pButton' onClick={onCancel}>Annuler</button>
          <button className="sButton" onClick={onConfirm}>Oui</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
