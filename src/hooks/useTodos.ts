import { useState, useEffect } from 'react';
import { TodoService } from '../services/TodoService';
import { Todo } from '../pages/api/types';
import { notification } from 'antd';

export const useTodos = () => {
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

  const addTodo = async (title: string, description: string) => {
    try {
      const newTodo = await TodoService.addTodo(title, description);
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      notification.success({
        message: 'Success',
        description: 'Todo added successfully',
      });
    } catch (error) {
      setError('Todo with the same title already exists');
      notification.error({
        message: 'Error',
        description: 'Todo with the same title already exists',
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await TodoService.deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const updateTodo = (id: string, updatedTodo: Todo) => {
    try {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };


  return {
    todos,
    isLoading,
    error,
    setTodos,
    addTodo,
    deleteTodo,
    updateTodo,
  };
};
