import { Dispatch, SetStateAction, useState } from 'react';
import { TodoService } from '../services/TodoService';
import { Input, Form, notification, Modal } from 'antd'; // Import Modal from 'antd'
import { Todo } from '../pages/api/types';
import { PlusOutlined } from '@ant-design/icons';

// CreateTodoFormProps interface
interface CreateTodoFormProps {
  setTodos: Dispatch<SetStateAction<Todo[]>>;
}

const CreateTodoForm: React.FC<CreateTodoFormProps> = ({ setTodos }) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [todoDescription, setTodoDescription] = useState('');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

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
          description: 'Todo aleady exists, please change your title...!',
        });
      }
    } else {
      notification.error({
        message: 'Error',
        description: 'Please enter a title for the todo',
      });
    }
  };
  
  // Function to handle showing the modal
  const showModal = () => {
    setModalVisible(true);
  };

  // Function to handle hiding the modal
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
            className='bg-indigo-600 hover:bg-indigo-700 text-white  cursor-pointer p-3 rounded-full flex justify-center items-center '
          >
            <PlusOutlined />
          </div>
        </Form.Item>
      </form>

      {/* Modal for alerting user */}
      <Modal
        title="Create Todo"
        visible={modalVisible}
        footer = {null}
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
            <Input.TextArea
              name="description"
              value={todoDescription}
              onChange={(e) => setTodoDescription(e.target.value)}
              placeholder="Enter todo description"
              style={{ height: '150px' }}
            />
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
