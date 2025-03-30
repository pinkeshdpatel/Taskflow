import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import { Task, TaskStatus } from '../types';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: TaskStatus;
  onAddTask: () => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ title, tasks, status, onAddTask }) => {
  return (
    <div className="bg-[#242424] rounded-lg p-3 md:p-4">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base md:text-lg font-medium text-white">{title}</h2>
          <span className="text-sm text-gray-400">{tasks.length}</span>
        </div>
        <button 
          onClick={onAddTask}
          className="p-1 hover:bg-[#2C2C2C] rounded transition-colors"
        >
          <Plus size={20} className="text-gray-400 hover:text-white" />
        </button>
      </div>
      
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3 min-h-[200px]"
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;