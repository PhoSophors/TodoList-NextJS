/**
 * CreateTodoForm component
 */

import React, { useState, useEffect } from 'react';
import { Form, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TodoModal from './TodoModal';
import { useTodos } from '../hooks/useTodos';

interface CreateTodoFormProps {
  addTodo: (title: string, description: string) => void;
}

const CreateTodoForm: React.FC<CreateTodoFormProps> = ({ addTodo }) => {
  const {  error } = useTodos();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Error',
        description: error,
        placement: 'topRight',
      });
    } 
  }, [error]);

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleCreateTodo = async (values: { title: string; description: string }) => {
    try {
      await addTodo(values.title, values.description); 
      handleModalClose();
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  return (
    <div className='flex justify-start'>
      <Form layout="inline">
        <Form.Item>
          <div
            onClick={handleModalOpen}
            className='bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer p-3 rounded-full flex justify-center items-center'
          >
            <PlusOutlined />
          </div>
        </Form.Item>
      </Form>

      <TodoModal
        visible={modalVisible}
        onCancel={handleModalClose}
        onCreate={handleCreateTodo}
        onUpdate={(_id) =>  {}}
      />
    </div>
  );
};

export default CreateTodoForm;
