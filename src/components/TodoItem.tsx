import React, { useState, useEffect } from 'react';
import UpdateTodoForm from './UpdateTodoForm';
import { TodoService } from '../services/TodoService';
import { Card, Button, Dropdown, Menu, notification } from 'antd';
import { Todo } from '../pages/api/types';
import {
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons';


// interface Todo {
//   id: string;
//   title: string;
//   description: string;
//   completed: boolean;
//   createdAt: string;
// }

interface TodoItemProps {
  todo: Todo;
  updateTodo: (id: string, updatedTodo: Todo) => void;
  deleteTodo: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, updateTodo, deleteTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState<boolean[]>([]);

  useEffect(() => {
    const storedCheckboxStates = localStorage.getItem(`todo-${todo.id}-checkboxStates`);
    if (storedCheckboxStates) {
      setCheckboxStates(JSON.parse(storedCheckboxStates));
    } else {
      setCheckboxStates(Array(todo.description.split('\n').length).fill(todo.completed));
    }
  }, [todo]);

  // Date formatting function
  const formatDate = (dateString: string) => {
    let date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Try to reformat the date string if the initial parsing fails
      date = new Date();
    }
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  
  // Handle delete todo
  const handleDelete = () => {
    try {
      deleteTodo(todo.id); 
  
      notification.success({
        message: 'Success',
        description: 'Todo deleted successfully',
      });
    } catch (error) {
      console.error('Failed to delete todo:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete todo. Please try again later.',
      });
    }
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
      const allChecked = checkboxStates.every(state => state);
      const updatedTodo = await TodoService.updateTodoService(
        todo.id,
        todo.title,
        todo.description,
        !allChecked // Toggle the completion status
      );

      const newCheckboxStates = checkboxStates.map(() => !allChecked);
      setCheckboxStates(newCheckboxStates);
      updateTodo(todo.id, updatedTodo);

      notification.success({
        message: 'Success',
        description: `All tasks marked as ${!allChecked ? 'complete' : 'incomplete'}`,
      });
      localStorage.setItem(`todo-${todo.id}-checkboxStates`, JSON.stringify(newCheckboxStates));
    } catch (error) {
      console.error('Failed to update todo:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update todo. Please try again later.',
      });
    }
  };

  const handleCheckboxChange = async (index: number) => {
    const newCheckboxStates = [...checkboxStates];
    newCheckboxStates[index] = !newCheckboxStates[index];
    setCheckboxStates(newCheckboxStates);

    try {
      const allChecked = newCheckboxStates.every(state => state);
      const updatedTodo = await TodoService.updateTodoService(
        todo.id,
        todo.title,
        todo.description,
        allChecked
      );

      updateTodo(todo.id, updatedTodo);
      
      notification.success({
        message: 'Success',
        description: `Task ${index + 1} marked as ${newCheckboxStates[index] ? 'complete' : 'incomplete'}`,
      });
      localStorage.setItem(`todo-${todo.id}-checkboxStates`, JSON.stringify(newCheckboxStates));
    } catch (error) {
      console.error('Failed to update todo:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update todo. Please try again later.',
      });
      setCheckboxStates([...checkboxStates]);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="mark"
        onClick={handleToggleComplete}
        icon={checkboxStates.every(state => state) ? <CloseOutlined /> : <CheckOutlined />}
      >
        Mark all as {checkboxStates.every(state => state) ? 'Incomplete' : 'Complete'}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="edit" onClick={handleEdit} icon={<EditOutlined />}>
        Edit
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" onClick={handleDelete} icon={<DeleteOutlined />}>
        Delete
      </Menu.Item>
    </Menu>
  );

  const databaseStatus = checkboxStates.every(state => state) === true;

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
          style={{
            position: 'relative',
            backgroundColor: databaseStatus ? '#d9f99d' : ''
          }}
          className="group card-todo xl:w-64 md:w-64 w-auto"
        >
          <Card.Meta
            title={<div className="line-clamp-2">{todo.title}</div>}
            description={
              <div className="line-clamp-6">
                {todo.description.split('\n').map((item, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={checkboxStates[index] || false}
                      onChange={() => handleCheckboxChange(index)}
                    />
                    <span style={{ textDecoration: checkboxStates[index] ? 'line-through' : 'none' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            }
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
