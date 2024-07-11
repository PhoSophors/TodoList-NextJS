import React, { useState } from 'react';
import TodoItem from './TodoItem';
import { Todo } from '@/pages/api/types';
import { Input } from 'antd';

interface TodoListProps {
  todos?: Todo[];
  updateTodo: (id: string, updatedTodo: Todo) => void;
  deleteTodo: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos = [], updateTodo, deleteTodo }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter todos based on the search term
  const filteredTodos = todos.filter(todo => 
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className='flex justify-center p-2 mx-5'>
        <Input
          type="text"
          placeholder="Search todo by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-xl xl:w-96 md:w-96 w-full text-center"
        />
      </div>

      {filteredTodos.length === 0 ? (
        <div className="flex justify-center text-gray-500 p-4">
          No result. Create a new one instead!
        </div>
      ) : (
        <div className='flex grid mt-5 xl:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-3 xl:p-5 md:p-5 p-2'>
          {filteredTodos.map(todo => ( 
            <TodoItem key={todo.id} todo={todo} updateTodo={updateTodo} deleteTodo={deleteTodo} />
          ))}
        </div>
      )}
    </>
  );
};

export default TodoList;
