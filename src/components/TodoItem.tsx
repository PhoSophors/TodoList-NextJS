import React, { useState } from 'react';
import UpdateTodoForm from './UpdateTodoForm';
import { TodoService } from '../services/TodoService';
import { Card, Button, Dropdown, Menu, notification } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EllipsisOutlined, 
  CloseOutlined, 
  CheckOutlined  
} from '@ant-design/icons';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

interface TodoItemProps {
  todo: Todo;
  updateTodo: (id: string, updatedTodo: Todo) => void;
  deleteTodo: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, updateTodo, deleteTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdateTodo = (id: string, updatedTodo: Todo) => {
    updateTodo(todo.id, updatedTodo);
    setIsEditing(false);
  };

  const handleToggleComplete = async () => {
    try {
      const updatedTodo = await TodoService.toggleComplete(todo.id, todo.title, todo.description, todo.completed, todo.createdAt);
      updateTodo(todo.id, updatedTodo);
      notification.success({
        message: 'Success',
        description: `Todo marked as ${updatedTodo.completed ? 'completed' : 'incomplete'}`,
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update todo',
      });
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="mark" onClick={handleToggleComplete} icon={todo.completed ? <CheckOutlined /> : <CloseOutlined/>}>
        Mark as {todo.completed ? 'Incomplete' : 'Complete'}
      </Menu.Item>
      <hr />
      <Menu.Item key="edit" onClick={handleEdit} icon={<EditOutlined />}>
        Edit
      </Menu.Item>
      <hr />
      <Menu.Item key="delete" onClick={handleDelete} icon={<DeleteOutlined />}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <UpdateTodoForm 
        todo={todo} 
        updateTodo={handleUpdateTodo} 
        cancelEdit={cancelEdit} 
        visible={isEditing} 
      />
      <div
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <Card
          hoverable
          style={{ position: 'relative', height: 290 }}
          className="group"
        >
          <Card.Meta
            title={<div className="line-clamp-2">{todo.title}</div>}
            description={<div className="line-clamp-6">{todo.description}</div>}
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
          />
          <div className="absolute bottom-5 left-5 flex justify-center items-center">
            <p>{formatDate(todo.createdAt)}</p>
          </div>
          {showDropdown && (
            <Dropdown 
              overlay={menu} 
              trigger={['hover']} 
              placement="bottomRight"
              overlayStyle={{ width: 200 }}
            >
              <Button
                className="absolute bottom-5 right-5 bg"
                icon={<EllipsisOutlined />}
              />
            </Dropdown>
          )}
        </Card>
      </div>
    </>
  );
};

export default TodoItem;
