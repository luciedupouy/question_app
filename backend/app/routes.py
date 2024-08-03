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
        
@main.route('/get_questions/<form_name>', methods=['GET'])
def get_questions(form_name):
    language = request.args.get('lang', 'fr')  # 'fr' par défaut si non spécifié

    payload = {
        'token': '7FEF0B870961D07ED061AE440B1B314C',
        'content': 'metadata',
        'format': 'json',
        'forms[0]': form_name,
        'returnFormat': 'json',
        'lang': language  # Ajoutez le paramètre de langue ici
    }

    response = requests.post('https://redcap.cemtl.rtss.qc.ca/redcap/api/', data=payload)

    if response.status_code == 200:
        questions = json.loads(response.text)
        excluded_fields = ['id', 'nom', 'pr_nom', 'mail', 'avis']
        
        filtered_questions = [
            {
                'field_name': q['field_name'],
                'field_label': q.get('field_label', ''),
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

@main.route('/get_long_answer_question', methods=['GET'])
def get_long_answer_question():
    payload = {
        'token': '7FEF0B870961D07ED061AE440B1B314C',
        'content': 'metadata',
        'format': 'json',
        'forms[0]': 'avis_interface',  
        'returnFormat': 'json'
    }
    
    response = requests.post('https://redcap.cemtl.rtss.qc.ca/redcap/api/', data=payload)
    
    if response.status_code == 200:
        questions = json.loads(response.text)
        long_answer_question = next((q for q in questions if q['field_type'] == 'notes'), None)
        if long_answer_question:
            return jsonify({
                'field_name': long_answer_question['field_name'],
                'field_label': long_answer_question['field_label']
            }), 200
        else:
            return jsonify({"error": "Aucune question à longue réponse trouvée"}), 404
    else:
        return jsonify({"error": "Impossible de récupérer la question"}), response.status_code

@main.route('/submit_long_answer', methods=['POST'])
def submit_long_answer():
    data = request.json
    user_id = data.get('id')
    field_name = data.get('field_name')
    answer = data.get('answer')
    
    if not all([user_id, field_name, answer]):
        return jsonify({"error": "Données manquantes"}), 400

    payload = {
        'token': '7FEF0B870961D07ED061AE440B1B314C',
        'content': 'record',
        'action': 'import',
        'format': 'json',
        'type': 'flat',
        'overwriteBehavior': 'overwrite',
        'forceAutoNumber': 'false',
        'data': json.dumps([{
            'id': user_id,
            field_name: answer
        }]),
        'returnContent': 'count',
        'returnFormat': 'json'
    }
    
    response = requests.post('https://redcap.cemtl.rtss.qc.ca/redcap/api/', data=payload)
    
    if response.status_code == 200:
        return jsonify({"message": "Réponse soumise avec succès"}), 200
    else:
        return jsonify({"error": response.text}), response.status_code

@main.route('/get_answers/<user_id>', methods=['GET'])
def get_answers(user_id):
    print(f"Attempting to get answers for user ID: {user_id}")
    
    payload = {
        'token': '7FEF0B870961D07ED061AE440B1B314C',
        'content': 'record',
        'action': 'export',
        'format': 'json',
        'type': 'flat',
        'records[0]': user_id,
        'returnFormat': 'json'
    }
    
    try:
        response = requests.post('https://redcap.cemtl.rtss.qc.ca/redcap/api/', data=payload)
        print(f"REDCap API response status: {response.status_code}")
        
        if response.status_code == 200:
            answers = json.loads(response.text)
            print(f"Retrieved answers: {answers}")
            
            if not answers:
                print("No answers found for this user ID")
                return jsonify({"error": "Aucune réponse trouvée pour cet utilisateur"}), 404
            
            # Filtrer les champs non vides
            filtered_answers = {k: v for k, v in answers[0].items() if v}
            print(f"Filtered answers: {filtered_answers}")
            
            return jsonify(filtered_answers), 200
        else:
            print(f"Error response from REDCap: {response.text}")
            return jsonify({"error": f"Erreur lors de la récupération des données: {response.text}"}), response.status_code
    
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return jsonify({"error": f"Erreur interne du serveur: {str(e)}"}), 500


@main.route('/check_identity', methods=['POST'])
def check_identity():
    print("Received check_identity request")
    try:
        data = request.json
        print("Received data:", data)
        
        if not data:
            print("No data received")
            return jsonify({'error': 'Aucune donnée reçue'}), 400
        
        email = data.get('email')
        user_id = data.get('id')
        
        print(f"Extracted email: {email}, id: {user_id}")
        
        if not email or not user_id:
            print("Missing email or ID")
            return jsonify({'error': 'Email ou ID manquant'}), 400

        # Normalisation des données
        email = email.lower().strip()
        user_id = str(user_id).strip()

        # Récupération des données de REDCap
        payload = {
            'token': '7FEF0B870961D07ED061AE440B1B314C',
            'content': 'record',
            'action': 'export',
            'format': 'json',
            'type': 'flat',
            'records[0]': user_id,
            'fields[0]': 'id',
            'fields[1]': 'mail',
            'returnFormat': 'json'
        }
        
        response = requests.post('https://redcap.cemtl.rtss.qc.ca/redcap/api/', data=payload)
        print("REDCap API response:", response.text)
        print("REDCap API status code:", response.status_code)
        
        if response.status_code == 200:
            records = json.loads(response.text)
            if records:
                record = records[0]
                if record['id'] == user_id and record['mail'].lower().strip() == email:
                    print("Identity verified")
                    return jsonify({'message': 'Identité vérifiée'}), 200
            
            print("No matching record found")
            return jsonify({'error': 'Identité non valide'}), 400

        print(f"Error retrieving data from REDCap. Status code: {response.status_code}")
        return jsonify({'error': 'Erreur lors de la récupération des données depuis REDCap'}), response.status_code

    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return jsonify({'error': f'Erreur interne du serveur: {str(e)}'}), 500