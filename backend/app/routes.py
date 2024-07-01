from flask import Blueprint, request, jsonify
import requests
from .utils import send_to_redcap

main = Blueprint('main', __name__)

@main.route('/submit', methods=['POST'])
def submit():
    data = request.json
    response = send_to_redcap(data)
    return jsonify(response)
