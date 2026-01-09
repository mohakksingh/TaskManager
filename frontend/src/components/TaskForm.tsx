'use client';

import { useState, useEffect } from 'react';
import { Task } from '../types';
import Loader from './Loader';

interface TaskFormProps {
  initialData?: Partial<Task>;
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function TaskForm({ initialData, onSubmit, onCancel, isEditing = false }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit({ title, description });
      onCancel();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-black text-xl font-bold">{isEditing ? 'Edit Task' : 'New Task'}</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full text-black rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black "
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full text-black rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black "
              rows={3}
              
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:bg-gray-400 min-w-[80px]"
            >
              {loading ? <Loader size="sm" color="border-white" /> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
