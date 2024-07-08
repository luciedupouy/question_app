from flask import Blueprint, request, jsonify
import requests
import json

main = Blueprint('main', __name__)

@main.route('/submit', methods=['POST'])
def submit():
    data = request.json
    payload = {
        'token': '7FEF0B870961D07ED061AE440B1B314C',
        'content': 'record',
        'action': 'import',
        'format': 'json',
        'type': 'flat',
        'overwriteBehavior': 'normal',
        'forceAutoNumber': 'false',
        'data': json.dumps([{
            'nom': data.get('nom', ''),
            'pr_nom': data.get('pr_nom', ''),
            'mail': data.get('mail', '')
        }]),
        'returnContent': 'count',
        'returnFormat': 'json'
    }
    
    response = requests.post('https://redcap.cemtl.rtss.qc.ca/redcap/api/', data=payload)
    
    if response.status_code == 200:
        return jsonify({"message": "Data submitted successfully"}), 200
    else:
        print("Response Status Code:", response.status_code)
        print("Response Text:", response.text)
        return jsonify({"error": response.text}), response.status_code