import React from "react";
import TodoItem from "./TodoItem";

const TodoList = ({ todos, onToggleTodo, onRemoveTodo, onEditTodo }) => {
  return (
    <div>
      {todos.map((todo, index) => (
        <TodoItem
          key={index}
          todo={todo}
          onToggle={onToggleTodo}
          onRemove={onRemoveTodo}
          onEdit={onEditTodo}
        />
      ))}
    </div>
  );
};

export default TodoList;
