import { create } from 'zustand';
import { Task, TaskFilter, Comment, User } from '../types';
import { compareAsc, compareDesc, parseISO } from 'date-fns';

interface TaskState {
  tasks: Task[];
  users: User[];
  currentUser: User | null;
  filter: TaskFilter;
  addTask: (task: Omit<Task, 'id' | 'comments' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addComment: (taskId: string, content: string) => void;
  setFilter: (filter: TaskFilter) => void;
  getFilteredTasks: () => Task[];
  addUser: (user: Omit<User, 'id'>) => void;
  removeUser: (userId: string) => void;
}

const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  users: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      role: 'admin'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
      role: 'editor'
    }
  ],
  currentUser: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    role: 'admin'
  },
  filter: {},

  addUser: (user) => {
    const newUser = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
    };
    set((state) => ({ users: [...state.users, newUser] }));
    return newUser;
  },

  removeUser: (userId) => {
    set((state) => ({
      users: state.users.filter((user) => user.id !== userId),
      // Update tasks that were assigned to this user
      tasks: state.tasks.map((task) =>
        task.assignee === userId
          ? { ...task, assignee: '' }
          : task
      ),
    }));
  },

  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  updateTask: (id, updatedTask) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...updatedTask, updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },

  addComment: (taskId, content) => {
    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      taskId,
      userId: get().currentUser?.id || '',
      content,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, comments: [...task.comments, comment] }
          : task
      ),
    }));
  },

  setFilter: (filter) => {
    set({ filter });
  },

  getFilteredTasks: () => {
    const { tasks, filter } = get();
    let filteredTasks = [...tasks];

    if (filter.status) {
      filteredTasks = filteredTasks.filter((task) => task.status === filter.status);
    }

    if (filter.priority) {
      filteredTasks = filteredTasks.filter((task) => task.priority === filter.priority);
    }

    if (filter.assignee) {
      filteredTasks = filteredTasks.filter((task) => task.assignee === filter.assignee);
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
      );
    }

    if (filter.sortBy) {
      filteredTasks.sort((a, b) => {
        const order = filter.sortOrder === 'desc' ? -1 : 1;
        
        switch (filter.sortBy) {
          case 'dueDate':
            return order * (compareAsc(parseISO(a.dueDate), parseISO(b.dueDate)));
          case 'priority': {
            const priorityOrder = { low: 0, medium: 1, high: 2 };
            return order * (priorityOrder[b.priority] - priorityOrder[a.priority]);
          }
          case 'assignee':
            return order * a.assignee.localeCompare(b.assignee);
          default:
            return 0;
        }
      });
    }

    return filteredTasks;
  },
}));

export default useTaskStore;