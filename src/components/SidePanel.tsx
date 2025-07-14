import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

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

interface SidePanelProps {
  todos: Todo[];
  onTodoClick: (todo: Todo) => void;
  onCreateTodo: () => void;
  onDeleteTodo: (id: string) => void;
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function SidePanel({
  todos,
  onTodoClick,
  onCreateTodo,
  onDeleteTodo,
  isMobile,
  isOpen,
  setIsOpen,
}: SidePanelProps) {
  const panel = (
    <div className="flex h-full flex-col bg-white shadow-xl">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-medium">Todos</h2>
        <button
          onClick={onCreateTodo}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Todo
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-gray-200">
          {todos.map((todo) => (
            <li key={todo._id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onTodoClick(todo)}
                  className="text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  {todo.title}
                </button>
                <button
                  onClick={() => onDeleteTodo(todo._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-80">
                    <div className="flex h-full flex-col bg-white shadow-xl">
                      <div className="flex items-center justify-between p-4 border-b">
                        <Dialog.Title className="text-lg font-medium">
                          Todos
                        </Dialog.Title>
                        <button onClick={() => setIsOpen(false)}>
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                      {panel}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }

  return <div className="w-80 border-r h-full">{panel}</div>;
}
