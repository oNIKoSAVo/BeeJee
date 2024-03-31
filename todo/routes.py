from functools import wraps
from flask import Flask, jsonify, render_template, request, session, url_for, redirect, flash
from flask_login import login_required, login_user, logout_user, current_user
from flask_migrate import Migrate
from todo.forms import AddTaskForm, LoginForm

from todo.models import ToDo,User, db



def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')
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

def request_wants_json():
    best = request.accept_mimetypes.best_match(['application/json', 'text/html'])
    return best == 'application/json' and request.accept_mimetypes[best] > request.accept_mimetypes['text/html']


@app.route('/', methods=['GET', 'POST'])
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
    
    if form.validate_on_submit():
        new_task = ToDo(
            user_name=form.user_name.data,
            email=form.email.data,
            title=form.title.data
        )
        db.session.add(new_task)
        db.session.commit()
        return redirect('/')  # Если прошла валидация, то перенаправляем на главную

    if request_wants_json():
        todos = [todo.to_dict() for todo in todo_list]

        # Отправить данные в формате JSON
        return jsonify({
            'todos': todos,
            'pagination': {
                'page': pagination.page,
                'total_pages': pagination.pages,
                'total_items': pagination.total,
            }
        })
    else:
        # Это блок кода, который рендерит HTML-шаблон
        return render_template('todo/index.html', form=form, todo_list=todo_list, sort_by=sort_by, order=order, pagination=pagination)


@app.route('/add', methods=['POST'])
@save_state_to_session
def add_task():
    form = AddTaskForm()  # Создайте экземпляр формы
    
    # Если форма была отправлена и прошла валидацию, добавьте задачу в базу данных
    if form.validate_on_submit():
        new_task = ToDo(
            user_name=form.user_name.data,
            email=form.email.data,
            title=form.title.data
        )
        db.session.add(new_task)
        db.session.commit()
        return redirect('/')
    
    # Если форма не прошла валидацию, верните пользователю список ошибок
    else:
        return "Errors: {}".format(form.errors)
# @app.post('/add')
# def add():
#     title = request.form.get('title')
#     new_todo = ToDo(title=title, is_complete=False)
#     db.session.add(new_todo)
#     db.session.commit()
#     return redirect(url_for('home'))


@app.route('/tasks/<int:task_id>/edit', methods=['GET', 'POST'])
@login_required
@save_state_to_session
def edit_task(task_id):
    task = ToDo.query.get(task_id)
    db.session.refresh(task)  # Обновляем задачу перед редактированием
    if request.method == 'POST':
        if (task.user_name != request.form['user_name'] or
            task.email != request.form['email'] or
            task.title != request.form['title']):
            task.edited_by_admin = True
        
        task.user_name = request.form['user_name']
        task.email = request.form['email']
        task.title = request.form['title']
        db.session.commit()  # Применяем обновление
        return redirect(url_for('home'))
    return render_template('todo/edit_task.html', task=task) 

@app.get('/update/<int:todo_id>')
@login_required
@save_state_to_session
def update(todo_id):
    todo = ToDo.query.filter_by(id=todo_id).first()
    todo.is_complete = not todo.is_complete
    db.session.commit()
    return redirect(url_for('home'))


@app.get('/delete/<int:todo_id>')
@login_required
@save_state_to_session
def delete(todo_id):
    todo = ToDo.query.filter_by(id=todo_id).first()
    db.session.delete(todo)
    db.session.commit()
    return redirect(url_for('home'))


@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember.data)
            return redirect(url_for('home'))
        else:
            flash('Invalid username/password combination')
    else:
      print(form.errors)  # Распечатает ошибки валидации в консоль
            
    return render_template('todo/login.html', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))