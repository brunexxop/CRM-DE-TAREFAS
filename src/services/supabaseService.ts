import { Task, User, DashboardStats } from './types';

// Este arquivo é um stub para futura integração com Supabase
// Deve seguir a mesma interface do mockService

export const supabaseService = {
  async login(email: string): Promise<User> {
    throw new Error('Supabase not configured');
  },

  async logout(): Promise<void> {
    throw new Error('Supabase not configured');
  },

  async checkAuth(): Promise<{ isLoggedIn: boolean; user: User | null }> {
    return { isLoggedIn: false, user: null };
  },

  async getTasks(): Promise<Task[]> {
    return [];
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    throw new Error('Supabase not configured');
  },

  async updateTask(task: Task): Promise<Task> {
    throw new Error('Supabase not configured');
  },

  async deleteTask(id: string): Promise<void> {
    throw new Error('Supabase not configured');
  },

  async getStats(): Promise<DashboardStats> {
    return {
      totalTasks: 0,
      pendingTasks: 0,
      completedTasks: 0,
      overdueTasks: 0,
      completionRate: 0
    };
  }
};
