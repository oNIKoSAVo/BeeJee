import os

from dotenv import load_dotenv

load_dotenv()

# /// = relative path, //// = absolute path
SECRET_KEY = os.urandom(24)
FLASK_APP = os.getenv('FLASK_APP')
FLASK_ENV = os.getenv('FLASK_ENV')
SQLALCHEMY_DATABASE_URI = os.getenv('DB_URL')
SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS')
JWT_BLACKLIST_ENABLED = True
JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']
JWT_SECRET_KEY = '54wb54jbbkjCXZ&^666!bvcx1fsd554sd1*&^$0f' 
