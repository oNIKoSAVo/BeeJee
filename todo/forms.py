from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import InputRequired, Email

class LoginForm(FlaskForm):
    username = StringField('username', validators=[InputRequired()])  # Измените email на username
    password = PasswordField('password', validators=[InputRequired()])
    remember = BooleanField('remember')
    

class AddTaskForm(FlaskForm):
    user_name = StringField('User Name', validators=[InputRequired()])  # новое поле
    email = StringField('Email', validators=[InputRequired(), Email("This field requires a valid email address")])  # новое поле
    title = StringField('Task Text', validators=[InputRequired()])  
    
    from wtforms.validators import InputRequired, Email, Length