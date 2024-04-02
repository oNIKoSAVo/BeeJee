from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class ToDo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    title = db.Column(db.String(100))
    is_complete = db.Column(db.Boolean)
    edited_by_admin = db.Column(db.Boolean)

    def to_dict(self):
        """Return a dictionary representation of a todo."""
        return {
            "id": self.id,
            "user_name": self.user_name,
            "email": self.email,
            "title": self.title,
            "is_complete": self.is_complete,
            "edited_by_admin": self.edited_by_admin,
        }


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True)
    password_hash = db.Column(db.String(100))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
