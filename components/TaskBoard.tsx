'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskColumn from './TaskColumn';
import TaskModal from './TaskModal';
import { ITask } from '@/lib/types';
import { createTask, getTasks, updateTask } from '@/services/scrumApi';

const columns = [
  { id: 'not-started', title: 'Not started', color: 'bg-gray-200' },
  { id: 'in-progress', title: 'In progress', color: 'bg-blue-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' },
];


export default function TaskBoard() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [lastTaskId, setLastTaskId] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      const initialTasks = await getTasks();
      setTasks(initialTasks);
    };
    fetchTasks();

  }, []);

  const generateTaskId = () => {
    const newId = lastTaskId + 1;
    setLastTaskId(newId);
    return `fth-${newId.toString().padStart(4, '0')}`;
  }

  const handleAddTask = (newTask: ITask) => {
    const newTaskId = generateTaskId();
    setTasks([...tasks, { ...newTask, taskId: newTaskId }]);
    createTask({...newTask, taskId: newTaskId});
    setIsModalOpen(false);
  };

  const handleEditTask = (updatedTask: ITask) => {
    setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
    console.log('updatedTask', updatedTask);
    updateTask(updatedTask);
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
      if (task._id === draggableId) {
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
          <h2 className="text-2xl font-semibold">JLH Board</h2>
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
            generateTaskId={generateTaskId}
          />
        )}
      </div>
    </DragDropContext>
  );
}