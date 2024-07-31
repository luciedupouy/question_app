import React from 'react';
import { Link } from 'react-router-dom';
import '../css/question.css'



function Tuto({ userId }) {

    return (
        <div>
            <div className="centre">
                <h1>Tuto</h1>
                Votre identifiant est le {userId}, gardez le précieusement pour vous identifier la prochaine fois. 
                <button className='loginButton'>
                    <Link className="lien" to={`/form-selection/`} >
                        Démarrer le questionnaire
                    </Link>
                </button>
            </div>
            <div className='marge'>
                <a href='/'>Continuer plus tard</a>
            </div>  
        </div>
        
    );
}

export default Tuto;