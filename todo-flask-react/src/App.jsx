import React, { useState, useEffect } from "react";
import {Routes, Route } from "react-router-dom";
import TodoList from "./Component/TodoList";
import AddTodoForm from "./Component/AddTodoForm";
import EditTodoForm from "./Component/EditTodoForm";
import Pagination from "./Component/Pagination";
import Login from "./Component/Login";
import Navbar from "./Component/Navbar";
import ReactModal from "react-modal";
import SortPanel from "./Component/SortPanel";

import "./App.css";

ReactModal.setAppElement("#root");

function App() {
  const [token, setToken] = useState(localStorage.getItem("username") !== null);
  const [todos, setTodos] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [editingTodo, setEditingTodo] = useState(null);
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("asc");

  const onLogin = (username) => {
    localStorage.setItem("username", username);
    setToken(true);
  };
  const onLogout = () => {
    fetch("https://asketasket.pythonanywhere.com/logout", {
      credentials: "include", // Включаем отправку куки
    })
      .then(() => {
        // Удаляем юзернейм из локального хранилища и обновляем state
        localStorage.removeItem("username");
        setToken(false);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    fetch("https://asketasket.pythonanywhere.com")
      .then((response) => response.json())
      .then((data) => setTodos(data.todos))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    fetch(
      `https://asketasket.pythonanywhere.com/?page=${page}&sort_by=${sortBy}&order=${order}`
    )
      .then((response) => response.json())
      .then((data) => {
        setTodos(data.todos);
        setTotalPages(data.pagination.total_pages);
      })
      .catch((error) => console.error(error));
  }, [page, sortBy, order]);

  const loadTodos = () => {
    fetch(
      `https://asketasket.pythonanywhere.com/?page=${page}&sort_by=${sortBy}&order=${order}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTodos(data.todos);
        setTotalPages(data.pagination.total_pages);
      })
      .catch((error) => console.error(error));
  };
  
/* eslint-disable */
  useEffect(() => {
    loadTodos();
  }, [page, sortBy, order]);
/* eslint-enable */
  
  const toggleTodo = (changedTodo) => {
    fetch(`https://asketasket.pythonanywhere.com/update/${changedTodo.id}`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Произошла ошибка при изменении!");
        } else {
          const updatedTodos = todos.map((todo) =>
            todo.id === changedTodo.id
              ? { ...todo, is_complete: !todo.is_complete }
              : todo
          );
          setTodos(updatedTodos);
        }
      })

      .catch((error) => {
        console.log(error);
        alert("Произошла ошибка при изменении ToDo");
      });
  };

  const removeTodo = (id) => {
    fetch(`https://asketasket.pythonanywhere.com/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Network response was not ok");
        }
        else {
          alert("Задача успешно удалена!")
        }
        return response.json();
      })
      .then((data) => {
        if (data.result === "success") {
          loadTodos();

         
        } else {
          alert("Произошла ошибка при удалении ToDo");
        }
      })
      .catch((error) => {
        console.error("Ошибка:", error);
        alert("Произошла ошибка при удалении ToDo");
      });
  };

  const editTodo = (id, updatedTodo) => {
    fetch(`https://asketasket.pythonanywhere.com/edit/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Network response was not ok");
        } else {
          alert("Задача успешно отредактирована!")
        }
        return response.json();
      })

     
      .then((data) => {
        const updatedTodos = todos.map((todo) =>
          todo.id === data.id ? { ...todo, ...data } : todo
        );
        setTodos(updatedTodos);
      })
      .then((data) => {
        const updatedTodos = todos.map((todo) =>
          todo.id === data.id ? { ...todo, ...data } : todo
        );
        setTodos(updatedTodos);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSortBy = (newSortBy) => {
    if (newSortBy === sortBy) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setOrder("asc");
    }
  };

  const handleSortOrder = () => {
    setOrder(order === "desc" ? "asc" : "desc");
  };

  const todoContent = () => {
    return (
      <>
        <div className="app-header">
          <Navbar loggedIn={token} onLogout={onLogout} />

          <SortPanel
            sortBy={sortBy}
            order={order}
            onSortBy={handleSortBy}
            onSortOrder={handleSortOrder}
          />
        </div>
        <div className="app">
          <div style={{ textAlign: "center" }}>
            <h1>Мой менеджер задач</h1>
          </div>

          <AddTodoForm onNewTodo={loadTodos} />
          <TodoList
            todos={todos}
            onToggleTodo={toggleTodo}
            onRemoveTodo={removeTodo}
            onEditTodo={setEditingTodo}
            token={token}
          />
          {editingTodo && (
            <ReactModal
              isOpen={true}
              onRequestClose={() => setEditingTodo(null)}
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
                content: {
                  position: "relative",
                  top: "auto",
                  left: "auto",
                  right: "auto",
                  bottom: "auto",
                  width: "40%",
                  border: "1px solid #ccc",
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "20px",
                  boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                },
              }}
            >
              <button
                onClick={() => setEditingTodo(null)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                ✖
              </button>
              <EditTodoForm
                todo={editingTodo}
                onUpdate={(newData) => {
                  editTodo(editingTodo.id, {
                    ...newData,
                    edited_by_admin: true,
                  });
                  setEditingTodo(null);
                }}
              />
            </ReactModal>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login onLogin={onLogin} />} />
        <Route path="/" element={todoContent()} />
      </Routes>
    </>
  );
}

export default App;
