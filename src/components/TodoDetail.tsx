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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{todo.title}</h1>
        <button
          onClick={handleAddItem}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Links
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Images
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {todo.items.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.name || '-'}</td>
                <td className="px-6 py-4">{item.notes || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.points || '-'}
                </td>
                <td className="px-6 py-4">
                  {item.links?.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      className="text-blue-600 hover:text-blue-800 block"
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
                      className="h-10 w-10 object-cover rounded-md inline-block mr-2"
                    />
                  )) || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-medium mb-4">
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
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={currentItem?.name || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  defaultValue={currentItem?.notes || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Points
                </label>
                <input
                  type="number"
                  name="points"
                  defaultValue={currentItem?.points || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Links (one per line)
                </label>
                <textarea
                  name="links"
                  defaultValue={currentItem?.links?.join('\n') || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image URLs (one per line)
                </label>
                <textarea
                  name="images"
                  defaultValue={currentItem?.images?.join('\n') || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
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
