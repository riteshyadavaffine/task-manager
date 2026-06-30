import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Header } from '../components/Header';
import { TaskForm } from '../components/TaskForm';
import { TaskCard } from '../components/TaskCard';
import { TaskFilter } from '../components/TaskFilter';
import { Task } from '../types/index';
import { tasksApi } from '../api/client';

export function TaskBoardPage() {
  const getErrorMessage = useCallback((err: unknown): string => {
    if (axios.isAxiosError<{ error?: string }>(err)) {
      return err.response?.data?.error || 'An error occurred';
    }
    return 'An error occurred';
  }, []);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Filter tasks whenever tasks or filter changes
  useEffect(() => {
    if (filter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter((t) => t.status === filter));
    }
  }, [tasks, filter]);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await tasksApi.getTasks();
      if (response.data.success && response.data.data) {
        setTasks(response.data.data);
      }
      setError('');
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [getErrorMessage]);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (title: string, description?: string) => {
    try {
      const response = await tasksApi.createTask(title, description);
      if (response.data.success && response.data.data) {
        setTasks([response.data.data, ...tasks]);
        setShowForm(false);
      }
    } catch (err: unknown) {
      throw err;
    }
  };

  const handleUpdateTask = async (id: string, title: string, description?: string) => {
    try {
      const response = await tasksApi.updateTask(id, title, description);
      if (response.data.success && response.data.data) {
        setTasks(tasks.map((t) => (t.id === id ? response.data.data! : t)));
        setEditingTask(null);
      }
    } catch (err: unknown) {
      throw err;
    }
  };

  const handleCompleteTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      const newStatus = task.status === 'COMPLETED' ? 'ACTIVE' : 'COMPLETED';
      try {
        const response = await tasksApi.updateTask(id, undefined, undefined, newStatus);
        if (response.data.success && response.data.data) {
          setTasks(tasks.map((t) => (t.id === id ? response.data.data! : t)));
        }
      } catch (err: unknown) {
        setError(getErrorMessage(err) || 'Failed to update task');
      }
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await tasksApi.deleteTask(id);
      if (response.data.success) {
        setTasks(tasks.filter((t) => t.id !== id));
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Failed to delete task');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">My Tasks</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {showForm && (
            <TaskForm
              task={editingTask}
              onSubmit={
                editingTask
                  ? (title, desc) => handleUpdateTask(editingTask.id, title, desc)
                  : handleCreateTask
              }
              onCancel={handleFormCancel}
            />
          )}

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mb-6 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              + New Task
            </button>
          )}

          <TaskFilter
            activeFilter={filter}
            onFilterChange={setFilter}
          />

          {loading ? (
            <div className="text-center py-8">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              {tasks.length === 0
                ? 'No tasks yet. Create one to get started!'
                : 'No tasks match the current filter.'}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleCompleteTask}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

