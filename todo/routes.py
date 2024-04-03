from functools import wraps
from flask import (
    Flask,
    jsonify,
    request,
    session,
)
from flask_cors import CORS, cross_origin

from flask_migrate import Migrate
from todo.functions.func import validate_todo
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity, jwt_required, get_jwt
)

from todo.models import ToDo, User, db




def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "supports_credentials": True}})
    app.config.from_pyfile("config.py")
    db.init_app(app)
    return app


app = create_app()
migrate = Migrate(app, db)
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
app.config['JWT_SECRET_KEY'] = '54wb54jbbkjCXZ&^666!bvcx1fsd554sd1*&^$0f'  # Change this!
jwt = JWTManager(app)

blacklist = set()

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
    message = validate_todo(data)
    if message != "success":
        return jsonify({"error": message}), 400

    try:
        new_task = ToDo(
            user_name=data["user_name"], email=data["email"], title=data["title"]
        )
        db.session.add(new_task)
        db.session.commit()

        return jsonify(new_task.to_dict()), 201

    except Exception as e:
        return jsonify({'error': 'Internal Server Error', 'message': str(e)}), 500

    


@app.route("/edit/<int:task_id>", methods=["GET", "POST"])
@jwt_required()
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
    return jsonify(task.to_dict()), 201


@app.route("/update/<int:todo_id>", methods=["POST"])
@jwt_required()
@cross_origin(supports_credentials=True)
def update(todo_id):
    todo = ToDo.query.filter_by(id=todo_id).first()
    todo.is_complete = not todo.is_complete
    try:
        db.session.commit()
        return jsonify({'result': 'success'}), 200
    except:
        return jsonify({'error': 'Internal Server Error'}), 500



@app.route("/delete/<int:todo_id>", methods=['DELETE'])
@jwt_required()
@cross_origin(supports_credentials=True)
def delete(todo_id):
    todo = ToDo.query.filter_by(id=todo_id).first()
    if todo is None:
        return jsonify({'error': 'Не удалось найти задачу!'}), 404  # Если задача не найдена, возвращает код ошибки
    db.session.delete(todo)
    db.session.commit()
    return jsonify({'result': 'success'}), 200 

@app.route("/login", methods=["POST"])
@cross_origin(supports_credentials=True)
def login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Bad Request'}), 400    

    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'error': 'Неверная комбинация имени пользователя и пароля'}), 401
    
@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    return jwt_payload["jti"] in blacklist

@app.route('/logout', methods=['DELETE'])
@jwt_required()
def logout():
    jwt_payload = get_jwt()
    jti = jwt_payload['jti']
    blacklist.add(jti)
    return jsonify({"logout": True}), 200
