'use client';

import { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskColumn from './TaskColumn';
import TaskModal from './TaskModal';
import { ITask } from '@/lib/types';

const columns = [
  { id: 'not-started', title: 'Not started', color: 'bg-gray-200' },
  { id: 'in-progress', title: 'In progress', color: 'bg-blue-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' },
];

const initialTasks: ITask[] = [
  { id: '1', taskId: 'TASK-001', description: 'Create project plan', assignee: 'John Doe', status: 'not-started', priority: 'high' },
  { id: '2', taskId: 'TASK-002', description: 'Design UI mockups', assignee: 'Jane Smith', status: 'in-progress', priority: 'medium' },
  { id: '3', taskId: 'TASK-003', description: 'Implement login functionality', assignee: 'Bob Johnson', status: 'done', priority: 'low' },
];

export default function TaskBoard() {
  const [tasks, setTasks] = useState<ITask[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  const handleAddTask = (newTask: ITask) => {
    setTasks([...tasks, { ...newTask, id: Date.now().toString() }]);
    setIsModalOpen(false);
  };

  const handleEditTask = (updatedTask: ITask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const openEditModal = (task: ITask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedTasks = tasks.map(task => {
      if (task.id === draggableId) {
        return { ...task, status: destination.droppableId as ITask['status'] };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">CRM App</h2>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter((task) => task.status === column.id)}
              color={column.color}
              onEditTask={openEditModal}
            />
          ))}
        </div>
        {isModalOpen && (
          <TaskModal
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTask(null);
            }}
            onSubmit={selectedTask ? handleEditTask : handleAddTask}
            task={selectedTask}
          />
        )}
      </div>
    </DragDropContext>
  );
}