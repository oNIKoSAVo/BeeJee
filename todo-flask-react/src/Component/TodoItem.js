import React from 'react';

const TodoItem = ({ todo, onToggle, onRemove, onEdit, token, onUpdate }) => {
  return (
    <div>
      <h2>{todo.title}</h2>
      <p>{todo.user_name} ({todo.email})</p>
      {todo.is_complete && <>✓</>}
      {todo.is_complete ? <span>Завершено</span> : <span>Не завершено</span>}

      {token && (
        <>
        {todo.edited_by_admin ? 
                <span>Отредактировано администратором</span> : 
                <span>Не отредактировано администратором</span>
            }
          <button onClick={(event) => {
            event.stopPropagation(); // Предотвратить вызов onToggle при нажатии кнопки "Редактировать"
            onEdit(todo);
          }}>Редактировать</button>
          <button onClick={(event) => {
            event.stopPropagation();
            onRemove(todo.id);
          }}>Удалить</button>
          <button onClick={(event) => {
              event.stopPropagation();
              onToggle(todo); // Вызываете эту функцию при клике на кнопку
            }}>{todo.is_complete ? 'Открыть' : 'Закрыть'}</button>
        </>
      )}
    </div>
  );
};


export default TodoItem;