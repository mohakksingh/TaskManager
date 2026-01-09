'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Task, Pagination } from '@/types';
import TaskItem from '@/components/TaskItem';
import TaskForm from '@/components/TaskForm';
import Loader from '@/components/Loader';
import { Plus, Search, Filter, User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filterStatus, setFilterStatus] = useState<'OPEN' | 'DONE' | ''>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [fetchLoading, setFetchLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setFetchLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (filterStatus) params.status = filterStatus;
      if (search) params.search = search;

      const { data } = await api.get('/tasks', { params });
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      toast.error('Failed to load tasks');
    } finally {
      setFetchLoading(false);
    }
  }, [page, filterStatus, search]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchTasks();
    }
  }, [loading, user, router, fetchTasks]);

  const handleCreate = async (data: { title: string; description?: string }) => {
    try {
      await api.post('/tasks', data);
      toast.success('Task created successfully');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdate = async (data: { title: string; description?: string }) => {
    if (!editingTask) return;
    try {
      await api.patch(`/tasks/${editingTask.id}`, data);
      toast.success('Task updated successfully');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleToggle = async (id: string) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'OPEN' ? 'DONE' : 'OPEN' } : t));
    try {
      await api.patch(`/tasks/${id}/toggle`);
    } catch (error) {
       toast.error('Failed to update task status');
       fetchTasks();
    }
  };

  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // ... (existing states)

  const handleDelete = async (id: string) => {
    // if (!confirm('Are you sure you want to delete this task?')) return; 
    setDeletingTaskId(id);
    try {
      console.log('Deleting task:', id);
      await api.delete(`/tasks/${id}`);
      console.log('Task deleted');
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (error: any) {
      console.error('Failed to delete', error);
      toast.error(error.response?.data?.error || 'Failed to delete task');
    } finally {
      setDeletingTaskId(null);
    }
  };

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader size="lg" /></div>;
  if (!user) return null; // Redirecting

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center justify-center rounded-full bg-gray-200 p-2 text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              <User className="h-6 w-6" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <button
                  onClick={logout}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-md border border-gray-300 pl-10 px-4 py-2 text-black focus:border-black focus:ring-black placeholder-gray-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value as any); setPage(1); }}
            className="rounded-md border border-gray-300 px-4 py-2 focus:border-black focus:ring-black text-black"
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="DONE">Done</option>
          </select>
          <button
            onClick={() => { setEditingTask(undefined); setIsModalOpen(true); }}
            className="flex items-center justify-center rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Task
          </button>
        </div>

        {fetchLoading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No tasks found. Create one!</div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }}
                onDelete={handleDelete}
                isDeleting={deletingTaskId === task.id}
              />
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border px-3 py-1 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">Page {pagination.page} of {pagination.totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="rounded-md border px-3 py-1 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {isModalOpen && (
          <TaskForm
            initialData={editingTask || {}}
            isEditing={!!editingTask}
            onSubmit={editingTask ? handleUpdate : handleCreate}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
