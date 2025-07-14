import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
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
  user: string;
}

interface SidePanelProps {
  todos: Todo[];
  onTodoClick: (todo: Todo) => void;
  onCreateTodo: (title: string) => void;
  onDeleteTodo: (id: string) => void;
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isLoading?: boolean;
}

export default function SidePanel({
  todos,
  onTodoClick,
  onCreateTodo,
  onDeleteTodo,
  isMobile,
  isOpen,
  setIsOpen,
  isLoading = false,
}: SidePanelProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      onCreateTodo(newTodoTitle);
      setNewTodoTitle('');
      setIsCreateModalOpen(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setTodoToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (todoToDelete) {
      onDeleteTodo(todoToDelete);
      setTodoToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const panel = (
    <div className="flex h-full flex-col bg-slate-800/90 backdrop-blur-sm shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
        <h2 className="text-lg font-medium text-yellow-400">Todos</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-slate-700 text-yellow-400 rounded-md hover:bg-slate-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          data-aos="zoom-in"
          data-aos-delay="300"
        >
          Create Todo
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse text-yellow-400">Loading todos...</div>
          </div>
        ) : (
          <ul className="divide-y divide-slate-700">
            {todos.map((todo, index) => (
              <li 
                key={todo._id} 
                className="hover:bg-slate-700 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={100 + index * 50}
              >
                <div className="flex items-center justify-between p-4">
                  <button
                    onClick={() => onTodoClick(todo)}
                    className="text-sm font-medium text-slate-200 hover:text-yellow-400 transition-colors duration-300 flex-1 text-left"
                  >
                    {todo.title}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(todo._id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-300 ml-4 p-1.5 rounded-full hover:bg-slate-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {todos.length === 0 && !isLoading && (
              <li 
                className="p-8 text-center text-slate-400"
                data-aos="fade-up"
              >
                No todos yet. Create one to get started.
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Transition.Root show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
            <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity backdrop-blur-sm" />
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
                      <div className="flex h-full flex-col bg-slate-800 shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
                          <Dialog.Title className="text-lg font-medium text-yellow-400">
                            Todos
                          </Dialog.Title>
                          <button 
                            onClick={() => setIsOpen(false)}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300"
                          >
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

        {/* Create Todo Modal */}
        <CreateTodoModal 
          isOpen={isCreateModalOpen}
          setIsOpen={setIsCreateModalOpen}
          title={newTodoTitle}
          setTitle={setNewTodoTitle}
          onSubmit={handleCreateSubmit}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          onConfirm={handleConfirmDelete}
        />
      </>
    );
  }

  return (
    <>
      <div className="w-80 border-r border-slate-700 h-full shadow-lg">{panel}</div>
      
      {/* Create Todo Modal */}
      <CreateTodoModal 
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        title={newTodoTitle}
        setTitle={setNewTodoTitle}
        onSubmit={handleCreateSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

// Create Todo Modal Component
function CreateTodoModal({
  isOpen,
  setIsOpen,
  title,
  setTitle,
  onSubmit
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-800 p-6 text-left align-middle shadow-xl transition-all border border-slate-700">
                <Dialog.Title
                  as="h3"
                  className="text-lg leading-6 font-bold text-yellow-400"
                >
                  Create New Todo
                </Dialog.Title>
                <form onSubmit={onSubmit}>
                  <div className="mt-4">
                    <label htmlFor="todoTitle" className="block text-sm font-medium text-slate-300">
                      Todo Title
                    </label>
                    <input
                      type="text"
                      id="todoTitle"
                      className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 text-slate-200"
                      placeholder="Enter todo title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      autoFocus
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-800"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-700 px-4 py-2 text-sm font-medium text-yellow-400 shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-800"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// Delete Confirmation Modal Component
function DeleteConfirmationModal({
  isOpen,
  setIsOpen,
  onConfirm
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-800 p-6 text-left align-middle shadow-xl transition-all border border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900/30">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-yellow-400"
                  >
                    Delete Todo
                  </Dialog.Title>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-slate-400">
                    Are you sure you want to delete this todo? This action cannot be undone.
                  </p>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-800"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                    onClick={onConfirm}
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
