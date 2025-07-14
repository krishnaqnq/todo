import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

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

interface TodoDetailProps {
  todo: Todo;
  onUpdateTodo: (todo: Todo) => void;
}

export default function TodoDetail({ todo, onUpdateTodo }: TodoDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddItem = () => {
    setCurrentItem(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setCurrentItem(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedTodo = {
      ...todo,
      items: todo.items.filter((item) => item._id !== itemId),
    };
    onUpdateTodo(updatedTodo);
  };

  const handleSubmitItem = (formData: Item) => {
    let updatedItems;
    if (isEditing && currentItem) {
      updatedItems = todo.items.map((item) =>
        item._id === currentItem._id ? { ...item, ...formData } : item
      );
    } else {
      // Let MongoDB generate the ID
      const newItem = {
        ...formData,
      };
      updatedItems = [...todo.items, newItem];
    }

    onUpdateTodo({
      ...todo,
      items: updatedItems,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div 
        className="flex justify-between items-center mb-6 bg-slate-800 rounded-lg shadow-md p-4 border border-slate-700"
        data-aos="fade-down"
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">{todo.title}</h1>
        <button
          onClick={handleAddItem}
          className="px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-800 text-yellow-400 rounded-md hover:from-blue-800 hover:to-indigo-900 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          data-aos="zoom-in"
          data-aos-delay="200"
        >
          Add Item
        </button>
      </div>

      <div 
        className="overflow-x-auto rounded-xl shadow-lg border border-slate-700 bg-slate-800"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-gradient-to-r from-slate-900 to-slate-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                Links
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                Images
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {todo.items.map((item, index) => (
              <tr 
                key={item._id} 
                className="hover:bg-slate-700 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={100 + index * 50}
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-300">{item.name || '-'}</td>
                <td className="px-6 py-4 text-slate-300">{item.notes || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.points ? 
                    <span className="px-2 py-1 bg-blue-900/50 text-yellow-400 rounded-full text-xs font-medium">
                      {item.points}
                    </span> : '-'}
                </td>
                <td className="px-6 py-4">
                  {item.links?.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      className="text-yellow-400 hover:text-yellow-300 block transition-colors duration-300 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link}
                    </a>
                  )) || '-'}
                </td>
                <td className="px-6 py-4">
                  {item.images?.map((image, i) => (
                    <img
                      key={i}
                      src={image}
                      alt={`Item ${i + 1}`}
                      className="h-10 w-10 object-cover rounded-md inline-block mr-2 hover:scale-150 transition-transform duration-300 cursor-pointer shadow-sm hover:shadow-md"
                    />
                  )) || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="text-yellow-400 hover:text-yellow-300 mr-4 p-1.5 rounded-full hover:bg-slate-600 transition-all duration-300"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="text-red-400 hover:text-red-300 p-1.5 rounded-full hover:bg-slate-600 transition-all duration-300"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {todo.items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  <div 
                    className="flex flex-col items-center justify-center"
                    data-aos="fade-up"
                  >
                    <img 
                      src="/file.svg" 
                      alt="No items" 
                      className="h-16 w-16 mb-4 opacity-60 invert"
                    />
                    <p>No items in this todo yet. Add one to get started.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

          <div 
            className="relative bg-slate-800 rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl border border-slate-700"
            data-aos="zoom-in"
          >
            <h3 className="text-lg font-medium mb-4 text-center bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              {isEditing ? 'Edit Item' : 'Add Item'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  _id: currentItem?._id || `temp_${Math.random().toString(36).substr(2, 9)}`,
                  name: formData.get('name') as string,
                  notes: formData.get('notes') as string,
                  points: formData.get('points')
                    ? Number(formData.get('points'))
                    : undefined,
                  links: formData.get('links')
                    ? (formData.get('links') as string).split('\n')
                    : [],
                  images: formData.get('images')
                    ? (formData.get('images') as string).split('\n')
                    : [],
                };
                handleSubmitItem(data);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-yellow-400">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={currentItem?.name || ''}
                  className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 text-slate-200 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400">
                  Notes
                </label>
                <textarea
                  name="notes"
                  defaultValue={currentItem?.notes || ''}
                  className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 text-slate-200 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400">
                  Points
                </label>
                <input
                  type="number"
                  name="points"
                  defaultValue={currentItem?.points || ''}
                  className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 text-slate-200 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400">
                  Links (one per line)
                </label>
                <textarea
                  name="links"
                  defaultValue={currentItem?.links?.join('\n') || ''}
                  className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 text-slate-200 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400">
                  Image URLs (one per line)
                </label>
                <textarea
                  name="images"
                  defaultValue={currentItem?.images?.join('\n') || ''}
                  className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 text-slate-200 transition-all duration-300"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors duration-300 border border-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-yellow-400 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-md hover:from-blue-800 hover:to-indigo-900 transition-all duration-300 shadow-md"
                >
                  {isEditing ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
