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

@main.route('/update', methods=['POST'])
def update():
    data = request.json
    user_id = data.get('id')
    
    if not user_id:
        return jsonify({"error": "ID de l'utilisateur manquant"}), 400

    # Récupérer les champs valides
    valid_fields_payload = {
        'token': '7FEF0B870961D07ED061AE440B1B314C',
        'content': 'exportFieldNames',
        'format': 'json',
        'returnFormat': 'json'
    }
    valid_fields_response = requests.post('https://redcap.cemtl.rtss.qc.ca/redcap/api/', data=valid_fields_payload)
    valid_fields = [field['original_field_name'] for field in json.loads(valid_fields_response.text)]

    # Filtrer les données pour ne garder que les champs valides
    filtered_data = {k: v for k, v in data.items() if k in valid_fields}
    filtered_data['id'] = user_id  # Assurez-vous que l'ID est inclus

    payload = {
        'token': '7FEF0B870961D07ED061AE440B1B314C',
        'content': 'record',
        'action': 'import',
        'format': 'json',
        'type': 'flat',
        'overwriteBehavior': 'overwrite',
        'forceAutoNumber': 'false',
        'data': json.dumps([filtered_data]),
        'returnContent': 'count',
        'returnFormat': 'json'
    }
    
    response = requests.post('https://redcap.cemtl.rtss.qc.ca/redcap/api/', data=payload)
    
    if response.status_code == 200:
        return jsonify({"message": "Data updated successfully"}), 200
    else:
        return jsonify({"error": response.text}), response.status_code
@main.route('/get_questions', methods=['GET'])
def get_questions():
    payload = {
        'token': '7FEF0B870961D07ED061AE440B1B314C',
        'content': 'metadata',
        'format': 'json',
        'returnFormat': 'json'
    }
    
    response = requests.post('https://redcap.cemtl.rtss.qc.ca/redcap/api/', data=payload)
    
    if response.status_code == 200:
        questions = json.loads(response.text)
        # Filtrer les métadonnées pour exclure les champs d'identification
        excluded_fields = ['id', 'nom', 'pr_nom', 'mail']
        filtered_questions = [
            {
                'field_name': q['field_name'],
                'field_label': q['field_label'],
                'field_type': q['field_type'],
                'select_choices_or_calculations': q.get('select_choices_or_calculations', '')
            }
            for q in questions if q['field_name'] not in excluded_fields
        ]
        return jsonify(filtered_questions), 200
    else:
        return jsonify({"error": "Impossible de récupérer les questions"}), response.status_code

@main.route('/get_valid_fields', methods=['GET'])
def get_valid_fields():
    payload = {
        'token': '7FEF0B870961D07ED061AE440B1B314C',
        'content': 'exportFieldNames',
        'format': 'json',
        'returnFormat': 'json'
    }
    
    response = requests.post('https://redcap.cemtl.rtss.qc.ca/redcap/api/', data=payload)
    
    if response.status_code == 200:
        fields = json.loads(response.text)
        return jsonify(fields), 200
    else:
        return jsonify({"error": "Impossible de récupérer les champs valides"}), response.status_code