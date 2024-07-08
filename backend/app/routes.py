from flask import Blueprint, request, jsonify
import requests
import json

main = Blueprint('main', __name__)

def get_last_id():
    payload = {
        'token': '7FEF0B870961D07ED061AE440B1B314C',
        'content': 'record',
        'action': 'export',
        'format': 'json',
        'type': 'flat',
        'fields': 'id',
        'returnFormat': 'json'
    }
    response = requests.post('https://redcap.cemtl.rtss.qc.ca/redcap/api/', data=payload)
    if response.status_code == 200:
        records = json.loads(response.text)
        if records:
            return max(int(record['id']) for record in records if record['id'])
    return 0

@main.route('/submit', methods=['POST'])
def submit():
    data = request.json
    last_id = get_last_id()
    new_id = last_id + 1

    payload = {
        'token': '7FEF0B870961D07ED061AE440B1B314C',
        'content': 'record',
        'action': 'import',
        'format': 'json',
        'type': 'flat',
        'overwriteBehavior': 'normal',
        'forceAutoNumber': 'false',
        'data': json.dumps([{
            'id': str(new_id),
            'nom': data.get('nom', ''),
            'pr_nom': data.get('pr_nom', ''),
            'mail': data.get('mail', '')
        }]),
        'returnContent': 'count',
        'returnFormat': 'json'
    }
    
    response = requests.post('https://redcap.cemtl.rtss.qc.ca/redcap/api/', data=payload)
    
    if response.status_code == 200:
        return jsonify({"message": "Data submitted successfully", "id": new_id}), 200
    else:
        print("Response Status Code:", response.status_code)
        print("Response Text:", response.text)
        return jsonify({"error": response.text}), response.status_code