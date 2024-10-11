'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ITask } from '@/lib/types';
import { CopyIcon } from 'lucide-react';

interface TaskModalProps {
  onClose: () => void;
  onSubmit: (task: ITask) => void;
  task?: ITask | null;
  generateTaskId: () => string;
}

export default function TaskModal({ onClose, onSubmit, task, generateTaskId }: TaskModalProps) {
  const [formData, setFormData] = useState<ITask>(() => {
    if (task) {
      return task;
    } else {
      return {
        taskId: generateTaskId(),
        description: '',
        assignee: '',
        status: 'not-started' as const,
        priority: 'low' as const,
      };
    }
  });

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const copyTaskId = () => {
    navigator.clipboard.writeText(formData.taskId);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {task ?
            <div className="flex items-center space-x-2">
              <Label htmlFor="taskId">Task ID</Label>
              <Input
                id="taskId"
                name="taskId"
                value={formData.taskId}
                onChange={handleChange}
                disabled
                className="flex-grow"
              />

              <Button type="button" onClick={copyTaskId} className="p-2 bg-black text-white hover:bg-gray-700 active:bg-gray-500 focus:outline-none">
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
            : null
          }
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="assignee">Assignee</Label>
            <Input id="assignee" name="assignee" value={formData.assignee} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not started</SelectItem>
                <SelectItem value="in-progress">In progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select name="priority" value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">{task ? 'Update Task' : 'Add Task'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}