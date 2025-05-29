import axios, { AxiosError } from 'axios';
// import { Task } from '@/types/task';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/tasks`;


interface Task {
    id: number;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    duedate: string;
    status: 'In Progress' | 'In Review' | 'On Hold' | 'Completed';
    category: 'Development' | 'Testing' | 'Bugs';
    description: {
      summary: string;
      details: string;
      acceptanceCriteria: string[];
      notes: string;
    };
  }

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  try {
    const response = await axios.post<Task>(API_URL, task);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(axiosError.response?.data?.message || 'Failed to create task');
  }
};

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get<Task[]>(API_URL);
    return response.data;
  } catch (error) {
    
    throw new Error(`${error}`);
  }
};

export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
  try {
    const response = await axios.patch<Task>(`${API_URL}/${id}`, task);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(axiosError.response?.data?.message || 'Failed to update task');
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    const response = await axios.delete<Task>(`${API_URL}/${id}`);
    console.log(response.data)
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(axiosError.response?.data?.message || 'Failed to delete task');
  }
};