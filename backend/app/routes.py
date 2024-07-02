import requests
from flask import Blueprint, request, jsonify, current_app

main = Blueprint('main', __name__)

@main.route('/submit', methods=['POST'])
def submit():
    # Récupérer les données envoyées par le client
    data = request.json  # Supposons que le front-end envoie les données en format JSON
    
    # Exemple: Envoyer les données à REDCap
    redcap_api_url = current_app.config['REDCAP_API_URL']
    redcap_api_token = current_app.config['REDCAP_API_TOKEN']
    
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    
    try:
        response = requests.post(redcap_api_url, headers=headers, json=data, params={'token': redcap_api_token})
        response.raise_for_status()  # Lève une exception en cas d'erreur HTTP
        return jsonify({'message': 'Data submitted successfully to REDCap'}), 200
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

@main.route('/config', methods=['GET'])
def get_config():
    redcap_api_url = current_app.config['REDCAP_API_URL']
    redcap_api_token = current_app.config['REDCAP_API_TOKEN']
    
    return jsonify({
        'redcap_api_url': redcap_api_url,
        'redcap_api_token': redcap_api_token
    })
