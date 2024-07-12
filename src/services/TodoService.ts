// Todo service 
import { Todo } from '../pages/api/types';

// The TodoService class provides static methods to interact with the API endpoints for todos.
export class TodoService {
  static updateTodo(id: string, todoTitle: string, todoDescription: string) {
    throw new Error('Method not implemented.');
  }

  static async fetchTodos(): Promise<Todo[]> {
    try {
      const response = await fetch('/api/todo');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const todosData = await response.json();
      return todosData as Todo[];
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  }

  // The addTodo method sends a POST request to the /api/todo endpoint with the todo text in the request body.
  static async addTodo(title: string, description: string): Promise<Todo> {
    try {
      const response = await fetch('/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
  
      if (!response.ok) {
        // Check specific HTTP status codes
        if (response.status === 409) {
          throw new Error('Todo with this title already exists');
        } else {
          throw new Error('Failed to add todo');
        }
      }
  
      const newTodo = await response.json();
      return newTodo as Todo;
    } catch (error) {
      console.error('Error adding todo:', error);
      throw error; // Rethrow the error for the caller to handle
    }
  }
  

  // The updateTodo method sends a PUT request to the /api/todo endpoint with the todo ID, text, and completed status in the request body.
  static async updateTodoService(id: string, title: string, description: string, completed: boolean) {
    try {
      const response = await fetch('/api/todo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, title, description, completed }),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      const updatedTodo = await response.json();
      return updatedTodo;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  // The deleteTodo method sends a DELETE request to the /api/todo endpoint with the todo ID in the request body.
  static async deleteTodo(id: string) {
    try {
      const response = await fetch('/api/todo', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      return { id };
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

  // The toggleComplete method sends a PUT request to the /api/todo endpoint with the todo ID, text, and the opposite of the current completed status in the request body.
  static async toggleComplete(id: string, title: string, description: string, completed: boolean, createdAt: string): Promise<Todo> {
    try {
      const response = await fetch('/api/todo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, title, description, completed: !completed, createdAt }),
      });
      if (!response.ok) throw new Error('Failed to toggle todo completion');
      const updatedTodo = await response.json();
      return updatedTodo;
    } catch (error) {
      console.error('Error toggling todo completion:', error);
      throw error;
    }
  }
}
