from flask import Blueprint, request, jsonify, current_app
import requests

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return "Hello, Flask!"

@main.route('/submit', methods=['POST'])
def submit():
    data = request.json

    redcap_data = {
        'token': current_app.config['REDCAP_API_TOKEN'],
        'content': 'record',
        'format': 'json',
        'type': 'flat',
        'data': [data]
    }

    response = requests.post(
        current_app.config['REDCAP_API_URL'],
        data=redcap_data
    )

    if response.status_code == 200:
        return jsonify({"status": "success", "message": "Data submitted to REDCap"}), 200
    else:
        return jsonify({"status": "error", "message": "Failed to submit data to REDCap"}), 500

@main.route('/results/<record_id>', methods=['GET'])
def get_results(record_id):
    redcap_data = {
        'token': current_app.config['REDCAP_API_TOKEN'],
        'content': 'record',
        'format': 'json',
        'type': 'flat',
        'records': [record_id]
    }

    response = requests.post(
        current_app.config['REDCAP_API_URL'],
        data=redcap_data
    )

    if response.status_code == 200:
        return jsonify(response.json()), 200
    else:
        return jsonify({"status": "error", "message": "Failed to fetch data from REDCap"}), 500
