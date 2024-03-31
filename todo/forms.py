from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import InputRequired, Email

class LoginForm(FlaskForm):
    email = StringField('email', validators=[InputRequired(), Email("This field requires a valid email address")])
    password = PasswordField('password', validators=[InputRequired()])
    remember = BooleanField('remember')