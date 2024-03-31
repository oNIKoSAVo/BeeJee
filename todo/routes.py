from flask import Flask, render_template, request, url_for, redirect, flash
from flask_login import login_user, current_user
from todo.forms import LoginForm

from todo.models import ToDo,User, db



def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')
    db.init_app(app)
    return app


app = create_app()


@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember.data)
            return redirect(url_for('home'))
        else:
            flash('Invalid username/password combination')
            
    return render_template('todo/login.html', form=form)

@app.get('/')
def home():
    todo_list = ToDo.query.all()
    return render_template('todo/index.html', todo_list=todo_list, title='Главная страница')


@app.post('/add')
def add():
    title = request.form.get('title')
    new_todo = ToDo(title=title, is_complete=False)
    db.session.add(new_todo)
    db.session.commit()
    return redirect(url_for('home'))


@app.get('/update/<int:todo_id>')
def update(todo_id):
    todo = ToDo.query.filter_by(id=todo_id).first()
    todo.is_complete = not todo.is_complete
    db.session.commit()
    return redirect(url_for('home'))


@app.get('/delete/<int:todo_id>')
def delete(todo_id):
    todo = ToDo.query.filter_by(id=todo_id).first()
    db.session.delete(todo)
    db.session.commit()
    return redirect(url_for('home'))
