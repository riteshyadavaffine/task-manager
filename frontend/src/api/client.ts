import axios, { AxiosInstance } from 'axios';
import { ApiResponse, Task, User } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Auth endpoints
export const authApi = {
  register: (email: string, password: string) =>
    apiClient.post<ApiResponse<User>>('/auth/register', { email, password }),

  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<User>>('/auth/login', { email, password }),

  logout: () =>
    apiClient.post<ApiResponse<null>>('/auth/logout'),

  me: () =>
    apiClient.get<ApiResponse<User>>('/auth/me'),
};

// Task endpoints
export const tasksApi = {
  getTasks: (status?: string) => {
    const params = status ? { status } : {};
    return apiClient.get<ApiResponse<Task[]>>('/api/tasks', { params });
  },

  getTaskById: (id: string) =>
    apiClient.get<ApiResponse<Task>>(`/api/tasks/${id}`),

  createTask: (title: string, description?: string) =>
    apiClient.post<ApiResponse<Task>>('/api/tasks', { title, description }),

  updateTask: (id: string, title?: string, description?: string, status?: string) =>
    apiClient.put<ApiResponse<Task>>(`/api/tasks/${id}`, {
      title,
      description,
      status,
    }),

  deleteTask: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/tasks/${id}`),
};

export default apiClient;

