import re

def validate_email(email):
    return bool(re.match('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', email))

def validate_todo(data):
    if not data or not validate_email(data.get('email', '')):
        return False
    if not data.get('user_name') or not data.get('email') or not data.get('title'):
        return False
    return True