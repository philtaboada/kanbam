import api from './api';
import { ITask } from '@/lib/types';

export const getTasks = async () => {

  const response = await api.get('/scrum');
  return response.data;
};

export const getTaskById = async (id: string) => {
  const response = await api.get(`/scrum/${id}`);
  return response.data;
};

export const createTask = async (task: ITask) => {
  const response = await api.post('/scrum', task);
  return response.data;
};

export const updateTask = async (task: ITask) => {
  const response = await api.put(`/scrum/${task._id}`, task);
  console.log('response', response);
  return response.data;
};