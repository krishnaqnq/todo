'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import SidePanel from '@/components/SidePanel';
import TodoDetail from '@/components/TodoDetail';

interface Item {
  _id: string;
  name?: string;
  notes?: string;
  points?: number;
  links?: string[];
  images?: string[];
}

interface Todo {
  _id: string;
  title: string;
  items: Item[];
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos');
      setTodos(response.data);
    } catch (error) {
      toast.error('Failed to fetch todos');
    }
  };

  const handleCreateTodo = async () => {
    const title = prompt('Enter todo title:', 'Untitled Todo');
    if (title !== null) {
      try {
        const response = await axios.post('/api/todos', { title, items: [] });
        setTodos([response.data, ...todos]);
        setSelectedTodo(response.data);
        toast.success('Todo created successfully');
      } catch (error) {
        toast.error('Failed to create todo');
      }
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      try {
        await axios.delete(`/api/todos/${id}`);
        setTodos(todos.filter((todo) => todo._id !== id));
        if (selectedTodo?._id === id) {
          setSelectedTodo(null);
        }
        toast.success('Todo deleted successfully');
      } catch (error) {
        toast.error('Failed to delete todo');
      }
    }
  };

  const handleUpdateTodo = async (updatedTodo: Todo) => {
    try {
      const response = await axios.put(`/api/todos/${updatedTodo._id}`, updatedTodo);
      
      if (response.data) {
        setTodos(todos.map((todo) =>
          todo._id === updatedTodo._id ? response.data : todo
        ));
        setSelectedTodo(response.data);
        toast.success('Todo updated successfully');
      }
    } catch (error: any) {
      console.error('Error updating todo:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update todo';
      toast.error(errorMessage);
      
      // Revert changes in UI if the API call failed
      if (selectedTodo) {
        setSelectedTodo({ ...selectedTodo });
      }
    }
  };

  return (
    <main className="flex h-screen overflow-hidden">
      <SidePanel
        todos={todos}
        onTodoClick={(todo: Todo) => setSelectedTodo(todo)}
        onCreateTodo={handleCreateTodo}
        onDeleteTodo={handleDeleteTodo}
        isMobile={isMobile}
        isOpen={isSidePanelOpen}
        setIsOpen={setIsSidePanelOpen}
      />
      <div className="flex-1 overflow-auto">
        {selectedTodo ? (
          <TodoDetail todo={selectedTodo} onUpdateTodo={handleUpdateTodo} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a todo from the sidebar or create a new one
          </div>
        )}
      </div>
      <Toaster position="bottom-right" />
    </main>
  );
}
