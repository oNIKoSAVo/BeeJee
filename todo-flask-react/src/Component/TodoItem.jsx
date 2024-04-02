import React from "react";
import "./MiniComponents/Button/button.scss";

const TodoItem = ({ todo, onToggle, onRemove, onEdit, token, onUpdate }) => {
  return (
    <div
      className={`todo-item ${
        todo.is_complete ? "todo-done" : "todo-not-done"
      }`}
    >
      <div style={{textAlign:"center"}}>
      <h2>{"Задача: " + todo.title}</h2>
      </div>
      
      <p>{"Пользователь: " + todo.user_name}</p>
      <p>{"Email: " + todo.email}</p>
      {todo.is_complete ? <p>✅ Завершено</p> : <p>❌ Не завершено</p>}

      {token && (
        <>
          <div>
            {todo.edited_by_admin ? (
              <p>Отредактировано администратором</p>
            ) : (
              <p>Не отредактировано администратором</p>
            )}
          </div>

          <div className="navigation">
            <button
              className="btn"
              onClick={(event) => {
                event.stopPropagation(); // Предотвратить вызов onToggle при нажатии кнопки "Редактировать"
                onEdit(todo);
              }}
            >
              Редактировать
            </button>

            <button
              className="btn btn--warning"
              onClick={(event) => {
                event.stopPropagation();
                onRemove(todo.id);
              }}
            >
              Удалить
            </button>

            <button
              className="btn btn--success"
              onClick={(event) => {
                event.stopPropagation();
                onToggle(todo); // Вызываете эту функцию при клике на кнопку
              }}
            >
              {todo.is_complete ? "Открыть" : "Закрыть"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
