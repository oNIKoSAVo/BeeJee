import React, { useState } from 'react';

const EditTodoForm = ({ todo, onUpdate }) => {
  const [updatedTodo, setUpdatedTodo] = useState({
    user_name: todo.user_name,
    email: todo.email,
    title: todo.title
  });

  const handleChange = (e) => {
    setUpdatedTodo({...updatedTodo, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!updatedTodo.title || !updatedTodo.user_name || !updatedTodo.email) return;
    onUpdate(updatedTodo);
  };

  

  return (
    <div>
      <h2>Редактировать задачу</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Имя пользователя:
          <input type="text" name="user_name" onChange={handleChange} value={updatedTodo.user_name} />
        </label><br/>
        <label>
          Email:
          <input type="text" name="email" onChange={handleChange} value={updatedTodo.email} />
        </label><br/>
        <label>
          Задача:
          <input type="text" name="title" onChange={handleChange} value={updatedTodo.title} />
        </label><br/>
        <input type="submit" value="Обновить" />
      </form>
    </div>
  );
}

export default EditTodoForm;