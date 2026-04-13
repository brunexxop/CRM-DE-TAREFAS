import { Task, User, DashboardStats } from './types';

const DELAY = 500; // Simular latência de rede (300-600ms)

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks',
  USER: 'taskflow_user',
  AUTH: 'taskflow_auth'
};

const SEED_TASKS: Task[] = [
  {
    id: '1',
    user_id: 'local-user',
    title: 'Configurar ambiente de desenvolvimento',
    description: 'Instalar Node.js, VS Code e extensões necessárias.',
    priority: 'Alta',
    status: 'Concluído',
    deadline: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'local-user',
    title: 'Revisar documentação do projeto',
    description: 'Ler os requisitos e o guia de estilo.',
    priority: 'Média',
    status: 'Pendente',
    deadline: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    user_id: 'local-user',
    title: 'Implementar autenticação mock',
    description: 'Criar o serviço de autenticação local usando localStorage.',
    priority: 'Crítico',
    status: 'Em Andamento',
    deadline: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  }
];

export const mockService = {
  // Auth
  async login(email: string): Promise<User> {
    await sleep(DELAY);
    const user: User = {
      id: 'local-user',
      name: email.split('@')[0],
      email,
      avatar: `https://picsum.photos/seed/${email}/200`
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    return user;
  },

  async logout(): Promise<void> {
    await sleep(DELAY);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  async checkAuth(): Promise<{ isLoggedIn: boolean; user: User | null }> {
    const isAuth = localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    return {
      isLoggedIn: isAuth,
      user: savedUser ? JSON.parse(savedUser) : null
    };
  },

  // Tasks
  async getTasks(): Promise<Task[]> {
    await sleep(DELAY);
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(SEED_TASKS));
      return SEED_TASKS;
    }
    return JSON.parse(saved);
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    await sleep(DELAY);
    const tasks = await this.getTasks();
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    const updatedTasks = [newTask, ...tasks];
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
    return newTask;
  },

  async updateTask(updatedTask: Task): Promise<Task> {
    await sleep(DELAY);
    const tasks = await this.getTasks();
    const updatedTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
    return updatedTask;
  },

  async deleteTask(id: string): Promise<void> {
    await sleep(DELAY);
    const tasks = await this.getTasks();
    const updatedTasks = tasks.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
  },

  // Stats
  async getStats(): Promise<DashboardStats> {
    const tasks = await this.getTasks();
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Concluído').length;
    const pending = tasks.filter(t => t.status === 'Pendente' || t.status === 'Em Andamento').length;
    const overdue = tasks.filter(t => t.status === 'Atrasado').length;
    
    return {
      totalTasks: total,
      pendingTasks: pending,
      completedTasks: completed,
      overdueTasks: overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }
};
