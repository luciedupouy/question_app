import React from 'react';
import { Link } from 'react-router-dom';
import '../css/question.css';
import { useLanguage } from '../components/LangContext'; // Importez le contexte de langue
import { translationsTuto } from '../translations/translationTuto'; // Importez les traductions spécifiques à Tuto

function Tuto({ userId }) {
    const { language } = useLanguage(); // Utilisez le contexte de langue
    const texts = translationsTuto[language]; // Obtenez les textes pour le composant Tuto

    return (
        <div>
            <div className="centre2">
                <h1>{texts.title}</h1>
                <p>{texts.idMessage.replace('{userId}', userId)}</p>
                <button className='loginButton'>
                    <Link className="lien" to={`/form-selection/`} >
                        {texts.startButton}
                    </Link>
                </button>
            </div>
            <div className='marge'>
                <a href='/'>{texts.continueLater}</a>
            </div>  
        </div>
    );
}

export default Tuto;
