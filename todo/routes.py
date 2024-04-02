from functools import wraps
from flask import (
    Flask,
    jsonify,
    render_template,
    request,
    session,
    url_for,
    redirect,
    flash,
)
from flask_cors import CORS, cross_origin
from flask_login import login_required, login_user, logout_user, current_user
from flask_migrate import Migrate
from todo.functions.func import validate_todo
from todo.forms import AddTaskForm, LoginForm

from todo.models import ToDo, User, db


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "supports_credentials": True}})
    # CORS(app, resources={r"/*": {"methods": "*"}})
    app.config.from_pyfile("config.py")
    db.init_app(app)
    return app


app = create_app()
migrate = Migrate(app, db)


def save_state_to_session(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        session["page"] = request.args.get("page", default=1, type=int)
        session["sort_by"] = request.args.get("sort_by", default="id")
        session["order"] = request.args.get("order", default="asc")
        return f(*args, **kwargs)

    return decorated_function




@app.route("/", methods=["GET", "POST"])
@cross_origin()
def home():
    form = AddTaskForm()

    sort_by = request.args.get('sort_by', default='id')
    order = request.args.get('order', default='asc')
    page = request.args.get('page', default=1, type=int)

    if order == 'desc':
        todos_query = ToDo.query.order_by(getattr(ToDo, sort_by).desc())
    else:
        todos_query = ToDo.query.order_by(getattr(ToDo, sort_by))

    pagination = todos_query.paginate(page, 3, False)
    todo_list = pagination.items

    if request.method == "POST":
        data = request.get_json()
        if not data or "user_name" not in data or "email" not in data or "title" not in data:
            return jsonify({"error": "Bad Request"}), 400

        new_task = ToDo(
            user_name=data["user_name"], email=data["email"], title=data["title"]
        )
        db.session.add(new_task)
        db.session.commit()
        
        return jsonify(new_task.to_dict()), 201

    todos = [todo.to_dict() for todo in todo_list]

    return jsonify({
        'todos': todos,
        'pagination': {
            'page': pagination.page,
            'total_pages': pagination.pages,
            'total_items': pagination.total,
        }
    })


@app.route("/add", methods=["POST"])
def add():
    data = request.get_json()
    if not validate_todo(data):
        return jsonify({"error": "Bad Request"}), 400

    new_task = ToDo(
        user_name=data["user_name"], email=data["email"], title=data["title"]
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

    


@app.route("/edit/<int:task_id>", methods=["GET", "POST"])
@login_required
@cross_origin(supports_credentials=True)
def edit_task(task_id):
    data = request.get_json()
    if not data or 'user_name' not in data or 'email' not in data or 'title' not in data:
        # Вернуть ошибку если одно или несколько полей отсутствуют
        return jsonify({'error': 'Bad Request'}), 400

    task = ToDo.query.get(task_id)
    if not task:
        return jsonify({'error': 'Not found'}), 404

    if (
        task.user_name != data["user_name"]
        or task.email != data["email"]
        or task.title != data["title"]
    ):
        task.edited_by_admin = True

    task.user_name = data["user_name"]
    task.email = data["email"]
    task.title = data["title"]

    db.session.commit()
    return jsonify(task.to_dict())


@app.route("/update/<int:todo_id>", methods=["GET", "POST"])
@login_required
@cross_origin(supports_credentials=True)
def update(todo_id):
    todo = ToDo.query.filter_by(id=todo_id).first()
    todo.is_complete = not todo.is_complete
    try:
        db.session.commit()
        return jsonify({'result': 'success'}), 200
    except:
        return jsonify({'error': 'Internal Server Error'}), 500

success = {"success": True, "message": "The task has been successfully deleted."}
fail = {"success": False, "message": "The task was not found."}

@app.route("/delete/<int:todo_id>", methods=['DELETE'])
@login_required
@cross_origin(supports_credentials=True)
def delete(todo_id):
    todo = ToDo.query.filter_by(id=todo_id).first()
    if todo is None:
        return jsonify(fail), 404  # Если задача не найдена, возвращает код ошибки
    db.session.delete(todo)
    db.session.commit()
    return jsonify({'result': 'success'}), 200 

@app.route("/login", methods=["POST"])
@cross_origin(supports_credentials=True)
def login():
    if current_user.is_authenticated:
       return jsonify({'result': 'success', 'data': 'Already logged in'}), 200
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Bad Request'}), 400    

    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        login_user(user, remember=True)
        return jsonify({'result': 'success'}), 200
    else:
        return jsonify({'error': 'Неверная комбинация имени пользователя и пароля'}), 401


@app.route("/logout")
@cross_origin(supports_credentials=True)
def logout():
    logout_user()
    return "Logout Successful"
