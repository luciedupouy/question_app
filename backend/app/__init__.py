from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# Créer l'application Flask
app = Flask(__name__)

# Charger les configurations depuis les variables d'environnement
app.config['REDCAP_API_URL'] = os.getenv('REDCAP_API_URL')
app.config['REDCAP_API_TOKEN'] = os.getenv('REDCAP_API_TOKEN')

# Activer CORS pour tous les chemins de l'application
CORS(app)

# Importer et enregistrer les blueprints
from app.routes import main
app.register_blueprint(main)
