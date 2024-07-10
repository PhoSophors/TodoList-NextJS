import React, { useState } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import { TodoService } from '../services/TodoService'; // Corrected import
import { Todo } from '../pages/api/types';

interface UpdateTodoFormProps {
  todo: Todo;
  updateTodo: (id: string, updatedTodo: Todo) => void;
  cancelEdit: () => void;
  visible: boolean;
}

const UpdateTodoForm: React.FC<UpdateTodoFormProps> = ({ todo, updateTodo, cancelEdit, visible }) => {
  const [editedTodo, setEditedTodo] = useState({ ...todo });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTodo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const updatedTodo = await TodoService.updateTodoService(editedTodo.id, editedTodo.title, editedTodo.description, editedTodo.completed);
      updateTodo(todo.id, updatedTodo);
      cancelEdit();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleCancel = () => {
    cancelEdit();
  };

  return (
    <Modal
      title="Edit Todo"
      visible={visible}
      onOk={handleSave}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <Form>
        <Form.Item label="Title">
          <Input name="title" value={editedTodo.title} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Description">
          <Input.TextArea name="description" value={editedTodo.description} onChange={handleChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateTodoForm;
