import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, notification } from 'antd';
import { TodoService } from '../services/TodoService';
import { Todo } from '../pages/api/types';

interface UpdateTodoFormProps {
  todo: Todo;
  updateTodo: (id: string, updatedTodo: Todo) => void;
  cancelEdit: () => void;
  visible: boolean;
}

const UpdateTodoForm: React.FC<UpdateTodoFormProps> = ({ todo, updateTodo, cancelEdit, visible }) => {
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [todoDescription, setTodoDescription] = useState(todo.description);

  useEffect(() => {
    setTodoTitle(todo.title);
    setTodoDescription(todo.description);
  }, [todo]);

  const handleUpdate = async () => {
    if (todoTitle.trim()) {
      try {
        const updatedTodo = await TodoService.updateTodoService(todo.id, todoTitle, todoDescription, todo.completed);
        updateTodo(todo.id, updatedTodo);

        notification.success({
          message: 'Success',
          description: 'Todo updated successfully',
        });
        cancelEdit();
      } catch (error) {
        console.error('Failed to update todo:', error);
        
        notification.error({
          message: 'Error',
          description: 'Failed to update todo. Please try again later.',
        });
      }
    } else {
      notification.error({
        message: 'Error',
        description: 'Please enter a title for the todo',
      });
    }
  };

  return (
    <Modal
      title="Update Todo"
      visible={visible}
      footer={null}
      onCancel={cancelEdit}
      centered
    >
      <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
        <Form.Item
          rules={[{ required: true, message: 'Please enter a title for the todo' }]}
        >
          <Input
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
            placeholder="Enter todo title"
          />
        </Form.Item>
        <Form.Item>
          <Input.TextArea
            value={todoDescription}
            onChange={(e) => setTodoDescription(e.target.value)}
            placeholder="Enter todo description"
            rows={4}
            style={{ height: "150px" }}
          />
        </Form.Item>

        <Form.Item>
            <span>Previews</span>
            {todoDescription && (
              <div className="pl-5 mt-3">
                {todoDescription.split('\n').map((item, index) => (
                  <div key={index} className="flex items-center">
                    <input type="checkbox" className="mr-2 mt-2" />
                    <span className='mt-2'>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </Form.Item>

        <Form.Item>
          <button
            type="submit"
            className='bg-indigo-600 w-32 hover:bg-indigo-700 text-white p-3 rounded-xl'
          >
            Update Todo
          </button>
        </Form.Item>
      </form>
    </Modal>
  );
};

export default UpdateTodoForm;
