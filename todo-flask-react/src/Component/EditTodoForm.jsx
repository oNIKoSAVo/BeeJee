import React, { useState } from "react";
import "./component.css";

const EditTodoForm = ({ todo, onUpdate }) => {
  const [updatedTodo, setUpdatedTodo] = useState({
    user_name: todo.user_name,
    email: todo.email,
    title: todo.title,
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setUpdatedTodo({ ...updatedTodo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!updatedTodo.title || !updatedTodo.user_name || !updatedTodo.email) {
      setError("Пустые поля не допускаются!");
      return;
    }
    onUpdate(updatedTodo);
  };

  return (
    <>
      <div>
        <h2>Редактировать задачу</h2>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Имя пользователя:
            <input
              type="text"
              name="user_name"
              onChange={handleChange}
              value={updatedTodo.user_name}
            />
          </label>
          <label>
            Email:
            <input
              placeholder="kolua.ua99@mail.ru"
              type="text"
              name="email"
              onChange={handleChange}
              value={updatedTodo.email}
            />
          </label>
          <label>
            Задача:
            <input
              type="text"
              name="title"
              onChange={handleChange}
              value={updatedTodo.title}
            />
          </label>
          <button type="submit">Обновить</button>
          {error && (
            <div
              style={{ color: "red", marginTop: "10px", textAlign: "center" }}
            >
              {error}
            </div>
          )}{" "}
        </form>
      </div>
    </>
  );
};

export default EditTodoForm;
