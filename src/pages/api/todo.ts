// pages/api/todos.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../database/firebaseConfig';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, where, query, documentId } from 'firebase/firestore';
import { Todo } from './types';

type Data = Todo | Todo[] | { error: string };

// Get all todos from Firestore
const getTodos = async (): Promise<Todo[]> => {
  const todosCollection = collection(db, 'todos');
  const querySnapshot = await getDocs(todosCollection);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Todo[];
};

// Add a new todo to Firestore
const addTodo = async (title: string, description: string): Promise<Todo> => {
  const todosCollection = collection(db, 'todos');
  
  // Query for todos with the same title
  const q = query(todosCollection, where("title", "==", title));
  const querySnapshot = await getDocs(q);
  
  // Check if any todos exist with the same title
  if (!querySnapshot.empty) {
    throw new Error("A todo with the same title already exists.");
  }

  const createdAt = new Date().toISOString();

  const newTodo = { title, description, completed: false, createdAt };
  const docRef = await addDoc(todosCollection, newTodo);
  return { id: docRef.id, ...newTodo };
};

// Update a todo in Firestore
const updateTodo = async (id: string, title: string, description: string, completed: boolean): Promise<Todo> => {
  const todosCollection = collection(db, 'todos');
  
  // Query for todos with the same title
  const q = query(todosCollection, where("title", "==", title), where(documentId(), "!=", id));
  const querySnapshot = await getDocs(q);
  
  // Check if any todos exist with the same title
  if (!querySnapshot.empty) {
    throw new Error("A todo with the same title already exists.");
  }

  const todoDoc = doc(db, 'todos', id);
  await updateDoc(todoDoc, { title, description, completed });

  return { id, title, description, completed, createdAt: '' };
};

// Delete a todo from Firestore
const deleteTodo = async (id: string): Promise<Todo> => {
  const todoDoc = doc(db, 'todos', id);
  await deleteDoc(todoDoc);
  
  return { id, title: '', description: '', completed: false, createdAt: '' };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    switch (req.method) {
      /** Get all todo */
      case 'GET':
        const todos = await getTodos();
        res.status(200).json(todos);
        break;

      /** Add or create todo */
      case 'POST':
        const { title, description } = req.body;
        if (!title) {
          res.status(400).json({ error: 'Title is required' });
          return;
        }
        const newTodo = await addTodo(title, description || '');
        res.status(201).json(newTodo);
        break;

      /** Update todo */
      case 'PUT':
        const { id, title: putTitle, description: putDescription, completed } = req.body;
        if (!id || putTitle === undefined || completed === undefined) {
          res.status(400).json({ error: 'ID, title, and completed status are required' });
          return;
        }
        const updatedTodo = await updateTodo(id, putTitle, putDescription || '', completed);
        res.status(200).json(updatedTodo);
        break;

      /** Delete todo */
      case 'DELETE':
        const { id: deleteId } = req.body;
        if (!deleteId) {
          res.status(400).json({ error: 'ID is required' });
          return;
        }
        const deletedTodo = await deleteTodo(deleteId);
        res.status(200).json(deletedTodo);
        break;

      /** Handle other HTTP methods */
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
