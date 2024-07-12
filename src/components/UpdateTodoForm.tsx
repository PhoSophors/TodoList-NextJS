
import React from 'react';
import { notification } from 'antd';
import { Todo } from '../pages/api/types'; 
import TodoModal from './TodoModal';
import { TodoService } from '../services/TodoService';

interface UpdateTodoFormProps {
  todo: Todo;
  updateTodo: (id: string, updatedTodo: Todo) => void;
  cancelEdit: () => void;
  visible: boolean;
}

const UpdateTodoForm: React.FC<UpdateTodoFormProps> = ({ todo, updateTodo, cancelEdit, visible }) => {

  const handleUpdate = async (id: string, values: { title: string; description: string }) => {
    try {
      const updatedTodo = await TodoService.updateTodoService(id, values.title, values.description, todo.completed);
      
      updateTodo(id, updatedTodo);
      cancelEdit();

      notification.success({
        message: 'Success',
        description: 'Todo updated successfully',
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update todo, this title already exit. Please try agian.',
      });
    }
  };

  return (
    <TodoModal
      visible={visible}
      onCancel={cancelEdit}
      onCreate={(_values) => {}}
      onUpdate={(_id, values) => handleUpdate(todo.id, values)} 
      todo={todo}
    />
  );
};

export default UpdateTodoForm;
