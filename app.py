from flask_login import LoginManager

from todo.routes import app, db
from todo.models import User

login_manager = LoginManager(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        app.run(debug=True)
        