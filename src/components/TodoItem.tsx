import React, { useState } from 'react';
import UpdateTodoForm from './UpdateTodoForm';
import { TodoService } from '../services/TodoService';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

interface TodoItemProps {
  todo: Todo;
  updateTodo: (id: string, updatedTodo: Todo) => void;
  deleteTodo: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, updateTodo, deleteTodo }) => {
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdateTodo = (id: string, updatedTodo: Todo) => {
    updateTodo(todo.id, updatedTodo);
    setIsEditing(false);
  };

  const handleToggleComplete = async () => {
    try {
      const updatedTodo = await TodoService.toggleComplete(todo.id, todo.title, todo.description, todo.completed, todo.createdAt);
      updateTodo(todo.id, updatedTodo);
      window.location.reload();
    } catch (error) {
      console.error('Failed to toggle todo completion:', error);
    }
  };

  return (
    <>
      <UpdateTodoForm 
        todo={todo} 
        updateTodo={handleUpdateTodo} 
        cancelEdit={cancelEdit} 
        visible={isEditing} 
      />
      <tr>
        <td className="border border-slate-300">{todo.id}</td>
        <td className="border border-slate-300" style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
          {todo.title}
        </td>
        <td className="border border-slate-300" style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
          {todo.description}
        </td>
        <td className="border border-slate-300">
          <button onClick={handleToggleComplete}>
            {todo.completed ? 'Incomplete' : 'Complete'}
          </button>
        </td>
        <td className="border border-slate-300">{formatDate(todo.createdAt)}</td>
        <td className="border border-slate-300 gap-2 mx-2 flex p-5">
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </td>
      </tr>
    </>
  );
};

export default TodoItem;
