export interface ITask {
  _id?: string;
  taskId: string;
  description: string;
  assignee: string;
  status: 'not-started' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}