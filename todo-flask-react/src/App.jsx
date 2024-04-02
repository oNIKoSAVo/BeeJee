import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
    // Выходим из системы на сервере
    fetch("http://localhost:5000/logout", {
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
    fetch("http://localhost:5000")
      .then((response) => response.json())
      .then((data) => setTodos(data.todos))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:5000/?page=${page}&sort_by=${sortBy}&order=${order}`
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
      `http://localhost:5000/?page=${page}&sort_by=${sortBy}&order=${order}`
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

  useEffect(() => {
    loadTodos();
  }, [page, sortBy, order]);

  const toggleTodo = (changedTodo) => {
    fetch(`http://localhost:5000/update/${changedTodo.id}`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((data) => {
        if (data.result === "success") {
          const updatedTodos = todos.map((todo) =>
            todo.id === changedTodo.id
              ? { ...todo, is_complete: !todo.is_complete }
              : todo
          );
          setTodos(updatedTodos);
        } else {
          alert("Произошла ошибка при изменении завершено/не завершено");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Произошла ошибка при изменении ToDo");
      });
  };

  const removeTodo = (id) => {
    fetch(`http://localhost:5000/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((data) => {
        if (data.result === "success") {
          const remainingTodos = todos.filter((todo) => todo.id !== id);
          setTodos(todos.filter((todo) => todo.id !== id));

          if (remainingTodos.length === 0 && page > 1) {
            setPage(page - 1);
          }

          alert("ToDo был успешно удален");
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
    fetch(`http://localhost:5000/edit/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
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
    // Если пользователь нажимает на текущую опцию сортировки, мы меняем порядок
    if (newSortBy === sortBy) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      // Иначе мы устанавливаем новую опцию сортировки и сбрасываем порядок на стандартный
      setSortBy(newSortBy);
      setOrder("asc");
    }
  };

  const handleSortOrder = () => {
    // Переключаем порядок сортировки между 'asc' и 'desc'
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
          <ReactModal isOpen={true} onRequestClose={() => setEditingTodo(null)}>
            <button onClick={() => setEditingTodo(null)}>✖</button>
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
