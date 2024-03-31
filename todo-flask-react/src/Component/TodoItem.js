import React from 'react';

const TodoItem = ({ todo, onToggle, onRemove, onEdit }) => {
    return (
      <div>
        <h2>{todo.title}</h2>
        <p>{todo.user_name} ({todo.email})</p>
        {todo.is_complete && <>✓</>}
        <button onClick={(event) => {
            event.stopPropagation(); // Предотвратить вызов onToggle при нажатии кнопки "Редактировать"
            onEdit(todo);
        }}>Редактировать</button>
        <button onClick={(event) => {
            event.stopPropagation();
            onRemove(todo.id);
        }}>Удалить</button>
      </div>
    );
  }

export default TodoItem;