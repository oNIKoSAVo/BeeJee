import React, { useState } from "react";
import Collapsible from "./MiniComponents/Collapsible";

const AddTodoForm = ({ onNewTodo }) => {
  const [newTodo, setNewTodo] = useState({
    title: "",
    user_name: "",
    email: "",
  });

  const handleChange = (e) => {
    setNewTodo({ ...newTodo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.title || !newTodo.user_name || !newTodo.email) return;

    fetch("http://localhost:5000/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Проверьте поля ");
        }
        return response.json();
      })
      .then((data) => {
        onNewTodo(data);
        setNewTodo({ title: "", user_name: "", email: "" });
      })
      .catch((e) =>
        alert("There was a problem with your fetch operation: " + e.message)
      );
  };
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button className="btn btn--success" onClick={() => setShowForm(!showForm)}>
        {showForm ? "⬅ Свернуть" : "Добавить задачу ⬇"}
      </button>
      <Collapsible
        shown={showForm}
        duration="0.3s"
      >
        <div className="form-container">
          <h2>Добавить задачу</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Имя пользователя:
              <input
                type="text"
                name="user_name"
                onChange={handleChange}
                value={newTodo.user_name}
              />
            </label>
            <label>
              Email:
              <input
                type="text"
                name="email"
                onChange={handleChange}
                value={newTodo.email}
              />
            </label>
            <label>
              Новая задача:
              <input
                type="text"
                name="title"
                onChange={handleChange}
                value={newTodo.title}
              />
            </label>

            <input className="btn btn--normal" type="submit" value="Добавить" />
          </form>
        </div>
      </Collapsible>
    </>
  );
};

export default AddTodoForm;
