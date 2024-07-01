import os
import requests

def send_to_redcap(data):
    api_url = os.getenv('REDCAP_API_URL')
    api_token = os.getenv('REDCAP_API_TOKEN')
    payload = {
        'token': api_token,
        'content': 'record',
        'format': 'json',
        'type': 'flat',
        'data': [data]
    }
    response = requests.post(api_url, data=payload)
    return response.json()
