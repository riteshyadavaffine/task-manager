import { Task } from '../types/index';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onComplete, onDelete, onEdit }: TaskCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded text-sm font-medium ${
            task.status === 'COMPLETED'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {task.status}
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        {new Date(task.createdAt).toLocaleDateString()}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onComplete(task.id)}
          className={`px-3 py-1 rounded text-sm font-medium text-white ${
            task.status === 'COMPLETED'
              ? 'bg-yellow-500 hover:bg-yellow-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {task.status === 'COMPLETED' ? 'Reopen' : 'Complete'}
        </button>
        <button
          onClick={() => onEdit(task)}
          className="px-3 py-1 rounded text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

