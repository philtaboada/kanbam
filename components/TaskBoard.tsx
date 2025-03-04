'use client';

import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskColumn from './TaskColumn';
import TaskModal from './TaskModal';
import { ITask } from '@/lib/types';
import { createTask, getLastTask, getTasks, updateTask } from '@/services/scrumApi';

const columns = [
  { id: 'not-started', title: 'Not started', color: 'bg-gray-200' },
  { id: 'in-progress', title: 'In progress', color: 'bg-blue-100' },
  { id: 'testing', title: 'Testing', color: 'bg-yellow-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' },
];

export default function TaskBoard() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [lastTaskId, setLastTaskId] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const [initialTasks, lastTask] = await Promise.all([
        getTasks(),
        getLastTask()
      ]);
      setTasks(initialTasks);
      const lastNumber = lastTask.taskId ? parseInt(lastTask.taskId.split('-')[1]) : 0;
      setLastTaskId(lastNumber);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const generateTaskId = useCallback(() => {
    const newId = lastTaskId + 1;
    setLastTaskId(newId);
    return `jlh-${newId.toString().padStart(4, '0')}`;
  }, [lastTaskId]);

  const handleAddTask = async (newTask: ITask) => {
    try {
      const newTaskId = generateTaskId();
      const taskWithId = { ...newTask, taskId: newTaskId };
      await createTask(taskWithId);
      setTasks(prev => [...prev, taskWithId]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async (updatedTask: ITask) => {
    try {
      await updateTask(updatedTask);
      setTasks(prev => prev.map(task => 
        task.taskId === updatedTask.taskId ? updatedTask : task
      ));
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const task = tasks.find(t => t.taskId === draggableId);
    if (!task) return;

    const updatedTask = { 
      ...task, 
      status: destination.droppableId as ITask['status'] 
    };

    try {
      await updateTask(updatedTask);
      setTasks(prev => prev.map(t => 
        t.taskId === draggableId ? updatedTask : t
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="relative h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">JLH Board</h2>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-4 min-h-[calc(100vh-12rem)]">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter((task) => task.status === column.id)}
              color={column.color}
              onEditTask={(task) => {
                setSelectedTask(task);
                setIsModalOpen(true);
              }}
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