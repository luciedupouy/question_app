import os

class Config:
    REDCAP_API_URL = os.getenv('REDCAP_API_URL')
    REDCAP_API_TOKEN = os.getenv('REDCAP_API_TOKEN')
