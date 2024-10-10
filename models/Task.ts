import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  taskId: string;
  description: string;
  assignee: string;
  status: 'not-started' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  startDate?: string;
  endDate?: string;
}

const TaskSchema: Schema = new Schema({
  taskId: { type: String, required: true },
  description: { type: String, required: true },
  assignee: { type: String, default: '' },
  status: { type: String, required: true, enum: ['not-started', 'in-progress', 'done'] },
  priority: { type: String, required: true, enum: ['low', 'medium', 'high'] },
  dueDate: { type: Date },
  startDate: { type: String },
  endDate: { type: String },
});

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);