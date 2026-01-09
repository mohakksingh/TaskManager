'use client';

import { Task } from '../types';
import { CheckCircle, Circle, Edit, Trash2 } from 'lucide-react';
import Loader from './Loader';
import clsx from 'clsx';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export default function TaskItem({ task, onToggle, onEdit, onDelete, isDeleting = false }: TaskItemProps) {
  return (
    <div className={clsx("flex items-center justify-between rounded-lg border p-4 shadow-sm transition-colors", task.status === 'DONE' ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-indigo-300')}>
      <div className="flex items-center space-x-4">
        <button onClick={() => onToggle(task.id)} className="text-gray-500 hover:text-indigo-600">
          {task.status === 'DONE' ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <Circle className="h-6 w-6" />
          )}
        </button>
        <div>
          <h3 className={clsx("font-medium text-black", task.status === 'DONE' && "text-gray-500 line-through")}>
            {task.title}
          </h3>
          {task.description && <p className="text-sm text-gray-500">{task.description}</p>}
        </div>
      </div>
      <div className="flex space-x-2">
        <button onClick={() => onEdit(task)} className="p-2 text-gray-500 hover:text-indigo-600">
          <Edit className="h-5 w-5" />
        </button>
        <button onClick={() => onDelete(task.id)} disabled={isDeleting} className="p-2 text-gray-500 hover:text-red-600 disabled:opacity-50">
          {isDeleting ? <Loader size="sm" /> : <Trash2 className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
