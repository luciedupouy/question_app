import React from 'react';
import { Link } from 'react-router-dom';


function Tuto({ userId }) {

    return (
        <div>
            <h1>Tuto</h1>
            Votre identifiant est le {userId}, gardez le précieusement pour vous identifier la prochaine fois. 
            <button>
                <Link to={`/questions/`} >
                    Démarrer le questionnaire
                </Link>
            </button>
        </div>
    );
}

export default Tuto;