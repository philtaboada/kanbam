export interface ITask {
  _id?: string;
  taskId: string;
  description: string;
  assignee: string;
  status: 'not-started' | 'in-progress' | 'testing' | 'done';
  priority: 'low' | 'medium' | 'high';
}