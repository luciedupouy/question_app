import os
from flask import Flask
from dotenv import load_dotenv

def create_app():
    app = Flask(__name__)
    
    # Charger les configurations depuis .env
    load_dotenv()
    app.config['REDCAP_API_URL'] = os.getenv('REDCAP_API_URL')
    app.config['REDCAP_API_TOKEN'] = os.getenv('REDCAP_API_TOKEN')

    from .routes import main
    app.register_blueprint(main)

    return app
