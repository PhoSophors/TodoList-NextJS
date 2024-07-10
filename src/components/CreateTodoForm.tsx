import { Dispatch, SetStateAction, useState } from 'react';
import { TodoService } from '../services/TodoService';
import { Input, Form, notification } from 'antd';
import { Todo } from '../pages/api/types';

interface CreateTodoFormProps {
  setTodos: Dispatch<SetStateAction<Todo[]>>;
}

const CreateTodoForm: React.FC<CreateTodoFormProps> = ({ setTodos }) =>  {
  const [todoTitle, setTodoTitle] = useState('');
  const [todoDescription, setTodoDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (todoTitle.trim()) {
      try {
        const newTodo = await TodoService.addTodo(todoTitle, todoDescription);
        setTodos((prevTodos) => [newTodo, ...prevTodos]);
        setTodoTitle('');
        setTodoDescription('');
        notification.success({
          message: 'Success',
          description: 'Todo added successfully',
        });
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Failed to add todo',
        });
      }
    } else {
      setError('Todo text cannot be empty.');
    }
  };

  return (
    <>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        
        <Form.Item label="Title">
          <Input name="title" 
           value={todoTitle}
           onChange={(e) => setTodoTitle(e.target.value)}
             placeholder="Enter todo title"
            />
        </Form.Item>

        <Form.Item label="Description">
          <Input.TextArea name="description"
             value={todoDescription}
             onChange={(e) => setTodoDescription(e.target.value)}
             placeholder="Enter todo description"
           />
        </Form.Item>
    
        <button type="submit" >Add Todo</button>
      </form>
    </>
  );
};

export default CreateTodoForm;
