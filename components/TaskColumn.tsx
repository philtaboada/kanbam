import { Droppable } from 'react-beautiful-dnd';
import { ITask } from '@/lib/types';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: ITask[];
  color: string;
  onEditTask: (task: ITask) => void;
}

export default function TaskColumn({ id, title, tasks, color, onEditTask }: TaskColumnProps) {
  return (
    <div className={`${color} p-4 rounded-lg`}>
      <h3 className="font-semibold mb-2">{title} <span className="text-gray-500">{tasks.length}</span></h3>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2 min-h-[200px]"
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onEdit={() => onEditTask(task)} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}