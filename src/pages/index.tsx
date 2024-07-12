import React from 'react';
import CreateTodoForm from '../components/CreateTodoForm';
import TodoList from '../components/TodoList';
import { useTodos } from '../hooks/useTodos';

const Home: React.FC = () => {
  const { todos, isLoading, addTodo, deleteTodo, updateTodo } = useTodos();

  if (isLoading) return <div className='flex justify-center items-center h-screen'>Loading...</div>;

  return (
    <div className='flex justify-center items-center flex-col'>
      <div className='xl:mt-20 md:mt-10 mt-5 flex'>
        <CreateTodoForm addTodo={addTodo} />
      </div>
      <div className=''>
        <TodoList todos={todos} updateTodo={updateTodo} deleteTodo={deleteTodo} />
      </div>
    </div>
  );
};

export default Home;