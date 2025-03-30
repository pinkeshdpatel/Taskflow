import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TaskFilter, User, TaskPriority } from '../types';
import useTaskStore from '../store/taskStore';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, users }) => {
  const { setFilter } = useTaskStore();
  const [filterData, setFilterData] = useState<TaskFilter>({
    priority: undefined,
    assignee: undefined,
    sortBy: undefined,
    sortOrder: 'asc',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter(filterData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#2C2C2C] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Filter Tasks</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={filterData.priority || ''}
              onChange={(e) => setFilterData({ ...filterData, priority: e.target.value as TaskPriority || undefined })}
              className="w-full px-3 py-2 bg-[#242424] border border-gray-600 rounded-lg text-white"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Assignee
            </label>
            <select
              value={filterData.assignee || ''}
              onChange={(e) => setFilterData({ ...filterData, assignee: e.target.value || undefined })}
              className="w-full px-3 py-2 bg-[#242424] border border-gray-600 rounded-lg text-white"
            >
              <option value="">All Assignees</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Sort By
            </label>
            <select
              value={filterData.sortBy || ''}
              onChange={(e) => setFilterData({ ...filterData, sortBy: e.target.value as 'dueDate' | 'priority' | 'assignee' || undefined })}
              className="w-full px-3 py-2 bg-[#242424] border border-gray-600 rounded-lg text-white"
            >
              <option value="">No Sorting</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="assignee">Assignee</option>
            </select>
          </div>

          {filterData.sortBy && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Sort Order
              </label>
              <select
                value={filterData.sortOrder}
                onChange={(e) => setFilterData({ ...filterData, sortOrder: e.target.value as 'asc' | 'desc' })}
                className="w-full px-3 py-2 bg-[#242424] border border-gray-600 rounded-lg text-white"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 bg-[#242424] rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterModal;