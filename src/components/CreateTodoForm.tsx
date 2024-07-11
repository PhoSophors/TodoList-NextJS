/**
 * CreateTodoForm component
 */

import { Dispatch, SetStateAction, useState } from 'react';
import { TodoService } from '../services/TodoService';
import { Input, Form, notification, Modal } from 'antd';
import { Todo } from '../pages/api/types';
import { PlusOutlined } from '@ant-design/icons';

// CreateTodoFormProps type
interface CreateTodoFormProps {
  setTodos: Dispatch<SetStateAction<Todo[]>>;
}

const CreateTodoForm: React.FC<CreateTodoFormProps> = ({ setTodos }) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [todoDescription, setTodoDescription] = useState('');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (todoTitle.trim()) {
      try {
        const newTodo = await TodoService.addTodo(todoTitle, todoDescription);
        setTodos((prevTodos) => [newTodo, ...prevTodos]);
        
        setTodoTitle('');
        setTodoDescription('');
        setModalVisible(false);

        notification.success({
          message: 'Success',
          description: 'Todo added successfully',
        });
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Todo already exists, please change your title...!',
        });
      }
    } else {
      notification.error({
        message: 'Error',
        description: 'Please enter a title for the todo',
      });
    }
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <div className='flex justify-start'>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form>
        <Form.Item>
          <div
            onClick={showModal}
            className='bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer p-3 rounded-full flex justify-center items-center'
          >
            <PlusOutlined />
          </div>
        </Form.Item>
      </form>

      <Modal
        title="Create Todo"
        visible={modalVisible}
        footer={null}
        onCancel={handleCancel}
        centered
      >
        <form onSubmit={handleSubmit}>
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
            <textarea
              className="w-full border rounded p-2"
              value={todoDescription}
              onChange={(e) => setTodoDescription(e.target.value)}
              placeholder="Enter todo description"
              style={{ height: '150px' }}
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

          <button
            type="submit"
            className='bg-indigo-600 w-32 hover:bg-indigo-700 text-white p-2 rounded-xl'
          >
            Create
          </button>

        </form>
      </Modal>
    </div>
  );
};

export default CreateTodoForm;
