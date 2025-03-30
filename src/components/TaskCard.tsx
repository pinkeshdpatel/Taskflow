import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, MessageSquare, User, MoreVertical, X, Check, ChevronRight } from 'lucide-react';
import { Task, Comment, TaskStatus } from '../types';
import useTaskStore from '../store/taskStore';
import { format, isAfter } from 'date-fns';

interface TaskCardProps {
  task: Task;
  index: number;
}

const priorityColors = {
  low: 'bg-green-500 text-green-500',
  medium: 'bg-yellow-500 text-yellow-500',
  high: 'bg-red-500 text-red-500',
};

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const statusTransitions: Record<TaskStatus, TaskStatus> = {
  'todo': 'in-progress',
  'in-progress': 'review',
  'review': 'completed',
  'completed': 'completed',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { updateTask, addComment, users, currentUser } = useTaskStore();
  const assignee = users.find(user => user.id === task.assignee);
  const isOverdue = isAfter(new Date(), new Date(task.dueDate));

  const handleProgressUpdate = (newProgress: number) => {
    updateTask(task.id, { progress: newProgress });
  };

  const handleAssigneeChange = (newAssigneeId: string) => {
    updateTask(task.id, { assignee: newAssigneeId });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(task.id, newComment);
      setNewComment('');
    }
  };

  const handleStatusChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = statusTransitions[task.status];
    const newProgress = newStatus === 'completed' ? 100 : task.progress;
    updateTask(task.id, { status: newStatus, progress: newProgress });
  };

  const TaskDetails = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e) => {
      if (e.target === e.currentTarget) {
        setIsDetailsOpen(false);
      }
    }}>
      <div className="bg-[#2C2C2C] rounded-lg p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-1 rounded text-xs bg-opacity-10 ${priorityColors[task.priority]}`}>
                {priorityLabels[task.priority]}
              </span>
              <span className={`text-xs ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-white">{task.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleStatusChange}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                task.status === 'completed'
                  ? 'bg-green-500 bg-opacity-20 text-green-500'
                  : 'bg-blue-500 bg-opacity-20 text-blue-500 hover:bg-opacity-30'
              }`}
            >
              {task.status === 'completed' ? (
                <span className="flex items-center gap-1">
                  <Check size={16} />
                  Completed
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <ChevronRight size={16} />
                  Move to {statusTransitions[task.status].split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsDetailsOpen(false)} 
              className="text-gray-400 hover:text-white p-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">Description</h3>
            <p className="text-gray-400">{task.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">Progress</h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={task.progress || 0}
                onChange={(e) => handleProgressUpdate(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{task.progress || 0}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">Assignee</h3>
            <select
              value={task.assignee}
              onChange={(e) => handleAssigneeChange(e.target.value)}
              className="w-full px-3 py-2 bg-[#242424] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            {assignee && (
              <div className="flex items-center gap-2 mt-2">
                <img src={assignee.avatar} alt={assignee.name} className="w-6 h-6 rounded-full" />
                <span className="text-gray-400">{assignee.name}</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">Comments</h3>
            <div className="space-y-4">
              {task.comments.map((comment) => {
                const commentUser = users.find(u => u.id === comment.userId);
                return (
                  <div key={comment.id} className="flex gap-3">
                    <img src={commentUser?.avatar} alt={commentUser?.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-white">{commentUser?.name}</span>
                        <span className="text-xs text-gray-400">
                          {format(new Date(comment.createdAt), 'MMM dd, HH:mm')}
                        </span>
                      </div>
                      <p className="text-gray-300 break-words">{comment.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleCommentSubmit} className="mt-4">
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-[#242424] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-[#2C2C2C] rounded-lg p-4 space-y-3 cursor-pointer touch-manipulation"
          onClick={() => setIsDetailsOpen(true)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newStatus = task.status === 'completed' ? 'todo' : 'completed';
                  const newProgress = newStatus === 'completed' ? 100 : 0;
                  updateTask(task.id, { status: newStatus, progress: newProgress });
                }}
                className={`w-5 h-5 rounded border ${
                  task.status === 'completed'
                    ? 'bg-green-500 border-green-500 flex items-center justify-center'
                    : 'border-gray-500 hover:border-white'
                }`}
              >
                {task.status === 'completed' && <Check size={12} className="text-white" />}
              </button>
              <span className={`px-2 py-1 rounded text-xs bg-opacity-10 ${priorityColors[task.priority]}`}>
                {priorityLabels[task.priority]}
              </span>
              <span className={`text-xs ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                {format(new Date(task.dueDate), 'MMM dd')}
              </span>
            </div>
            <button 
              className="text-gray-400 hover:text-white p-1"
              onClick={(e) => {
                e.stopPropagation();
                setIsDetailsOpen(true);
              }}
            >
              <MoreVertical size={16} />
            </button>
          </div>
          
          <h3 className="font-medium text-white">{task.title}</h3>
          <p className="text-sm text-gray-400 line-clamp-2">{task.description}</p>
          
          {task.progress !== undefined && (
            <div className="space-y-2">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-400">{task.progress}%</div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex -space-x-2">
              {assignee && (
                <img 
                  src={assignee.avatar} 
                  alt={assignee.name} 
                  className="w-6 h-6 rounded-full border-2 border-[#2C2C2C]" 
                  title={assignee.name}
                />
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="flex items-center gap-1">
                <MessageSquare size={14} />
                <span className="text-xs">{task.comments.length}</span>
              </div>
            </div>
          </div>

          {isDetailsOpen && <TaskDetails />}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;