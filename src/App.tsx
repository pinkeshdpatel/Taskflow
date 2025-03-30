import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Moon, Sun, Plus, Settings2, Search, Filter, UserPlus, Menu, X } from 'lucide-react';
import TaskColumn from './components/TaskColumn';
import TaskModal from './components/TaskModal';
import FilterModal from './components/FilterModal';
import UserModal from './components/UserModal';
import { Task, TaskStatus } from './types';
import useTaskStore from './store/taskStore';
import useAuthStore from './store/authStore';
import { useNavigate } from 'react-router-dom';

function App() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const {
    getFilteredTasks,
    addTask,
    updateTask,
    setFilter,
    currentUser,
    users
  } = useTaskStore();

  const { signOut } = useAuthStore();

  const tasks = getFilteredTasks();

  useEffect(() => {
    setFilter({ search: searchQuery });
  }, [searchQuery, setFilter]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as TaskStatus;
    
    updateTask(taskId, { status: newStatus });
  };

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#1C1C1C] text-white">
      <div className="container mx-auto px-4 py-4 md:px-6 md:py-6">
        <header className="mb-6 md:mb-8">
          {/* Mobile Header */}
          <div className="flex items-center justify-between md:hidden mb-4">
            <h1 className="text-xl font-semibold">TaskFlow</h1>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-[#2C2C2C] rounded-lg"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-[#2C2C2C] rounded-lg p-4 mb-4 space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex -space-x-2">
                  {users.map((user) => (
                    <img
                      key={user.id}
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-[#1C1C1C]"
                      title={user.name}
                    />
                  ))}
                </div>
                <span className="text-gray-400">Team</span>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="w-full flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus size={20} />
                  Add Task
                </button>
                <button
                  onClick={() => setIsUserModalOpen(true)}
                  className="w-full flex items-center gap-2 bg-[#242424] text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  <UserPlus size={20} />
                  Add Team Member
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 bg-red-600 bg-opacity-20 text-red-500 px-4 py-2 rounded-lg hover:bg-opacity-30"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-semibold">TaskFlow</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {users.map((user) => (
                      <img
                        key={user.id}
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border-2 border-[#1C1C1C]"
                        title={user.name}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400">Team</span>
                </div>
                <button
                  onClick={() => setIsUserModalOpen(true)}
                  className="p-2 rounded-lg bg-[#2C2C2C] hover:bg-gray-700 transition-colors"
                  title="Add Team Member"
                >
                  <UserPlus size={20} className="text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#2C2C2C] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="p-2 rounded-lg bg-[#2C2C2C] hover:bg-gray-700"
              >
                <Filter size={20} />
              </button>
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Add Task
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-red-600 bg-opacity-20 text-red-500 px-4 py-2 rounded-lg hover:bg-opacity-30"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2C2C2C] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex-1 p-2 rounded-lg bg-[#2C2C2C] hover:bg-gray-700 flex items-center justify-center gap-2"
              >
                <Filter size={20} />
                Filters
              </button>
            </div>
          </div>
        </header>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <TaskColumn
              title="To Do"
              tasks={tasks.filter((task) => task.status === 'todo')}
              status="todo"
              onAddTask={() => setIsTaskModalOpen(true)}
            />
            <TaskColumn
              title="In Progress"
              tasks={tasks.filter((task) => task.status === 'in-progress')}
              status="in-progress"
              onAddTask={() => setIsTaskModalOpen(true)}
            />
            <TaskColumn
              title="In Review"
              tasks={tasks.filter((task) => task.status === 'review')}
              status="review"
              onAddTask={() => setIsTaskModalOpen(true)}
            />
            <TaskColumn
              title="Completed"
              tasks={tasks.filter((task) => task.status === 'completed')}
              status="completed"
              onAddTask={() => setIsTaskModalOpen(true)}
            />
          </div>
        </DragDropContext>

        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSubmit={(task) => {
            addTask(task);
            setIsTaskModalOpen(false);
          }}
          users={users}
        />

        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          users={users}
        />

        <UserModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;