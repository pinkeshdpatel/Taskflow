import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      signIn: async (email: string, password: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Demo credentials
        if (email === 'demo@example.com' && password === 'password') {
          set({ 
            user: { 
              id: '1', 
              email 
            } 
          });
          return { error: null };
        }

        return { 
          error: new Error('Invalid credentials. Try demo@example.com / password') 
        };
      },

      signUp: async (email: string, password: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Create fake user
        const user = {
          id: Math.random().toString(36).substring(2),
          email
        };

        set({ user });
        return { error: null };
      },

      signOut: () => {
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;