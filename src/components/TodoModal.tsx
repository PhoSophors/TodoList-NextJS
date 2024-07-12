import React, { useState, useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { Todo } from '../pages/api/types'; 

interface TodoModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: TodoFormValues) => void;
  onUpdate: (id: string, values: TodoFormValues) => void;
  todo?: Todo;
}

interface TodoFormValues {
  title: string;
  description: string;
}

const TodoModal: React.FC<TodoModalProps> = ({ visible, onCancel, onCreate, onUpdate, todo }) => {
  const [form] = Form.useForm();
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    if (todo) {
      form.setFieldsValue({
        title: todo.title,
        description: todo.description,
      });
      setIsUpdateMode(true);
    } else {
      form.resetFields();
      setIsUpdateMode(false);
    }
  }, [visible, todo, form]);

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (isUpdateMode && todo) {
        onUpdate(todo.id, values);
      } else {
        onCreate(values);
      }
      onCancel();
    } catch (error) {
      console.error('Failed to submit the form:', error);
    }
  };

  return (
    <Modal
      title={isUpdateMode ? 'Update Todo' : 'Create Todo'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleFormSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          initialValue={todo ? todo.title : ''}
          rules={[{ required: true, message: 'Please enter a title for the todo' }]}
        >
          <Input placeholder="Enter todo title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          initialValue={todo ? todo.description : ''}
          rules={[{ required: true, message: 'Please enter a description for the todo' }]}
        >
          <Input.TextArea placeholder="Enter todo description" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TodoModal;
