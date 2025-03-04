import { Draggable } from 'react-beautiful-dnd';
import { ITask } from '@/lib/types';

interface TaskCardProps {
  task: ITask;
  index: number;
  onEdit: () => void;
}

export default function TaskCard({ task, index, onEdit }: TaskCardProps) {
  return (
    <Draggable draggableId={task.taskId} index={index}>
      {(provided) => (
        <div
          onClick={onEdit}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-3 rounded shadow hover:shadow-md transition-shadow"
        >
          <h4 className="font-medium">{task.description}</h4>
          <p className="text-sm text-gray-500">Assignee: {task.assignee}</p>
          <p className="text-sm text-gray-500">Priority: {task.priority}</p>
        </div>
      )}
    </Draggable>
  );
}