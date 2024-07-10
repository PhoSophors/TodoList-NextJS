import React from 'react';
import TodoItem from './TodoItem';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

interface TodoListProps {
  todos?: Todo[]; 
  updateTodo: (id: string, updatedTodo: Todo) => void;
  deleteTodo: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos = [], updateTodo, deleteTodo }) => {
  // Type guard to ensure todos is always an array
  if (!Array.isArray(todos)) {
    console.error('Invalid todos prop, expected an array');
    return null; 
  }

  return (
    <table id="customers" className="border-collapse border border-slate-400">
      <thead>
        <tr>
          <th className="border border-slate-300">ID</th>
          <th className="border border-slate-300">Title</th>
          <th className="border border-slate-300">Description</th>
          <th className="border border-slate-300">Status</th>
          <th className="border border-slate-300">Date</th>
          <th className="border border-slate-300">Action</th>
        </tr>
      </thead>
      <tbody>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} updateTodo={updateTodo} deleteTodo={deleteTodo} />
        ))}
      </tbody>
    </table>
  );
};

export default TodoList;