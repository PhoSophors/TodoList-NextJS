import { useState, useEffect } from 'react';
import CreateTodoForm from '../components/CreateTodoForm';
import TodoList from '../components/TodoList';
import { TodoService } from '../services/TodoService';
import { Todo } from '../pages/api/types'; 

const Home = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const todosData = await TodoService.fetchTodos();
        setTodos(todosData);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
        setError('Failed to fetch todos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const deleteTodo = async (id: string) => {
    try {
      await TodoService.deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const updateTodo = (id: string, updatedTodo: Todo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
    );
  };

  if (isLoading) return <div className='flex justify-center items-center h-screen'>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='flex justify-center items-center flex-col'>
      <div className='mt-20 flex'>
        <CreateTodoForm setTodos={setTodos} />
      </div>
     
      <div className=''>
        <TodoList todos={todos} updateTodo={updateTodo} deleteTodo={deleteTodo} />
      </div>
    
    </div>
  );
};

export default Home;
