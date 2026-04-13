import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Settings from './components/Settings';
import NewTask from './components/NewTask';
import Login from './components/Login';
import TaskModal from './components/TaskModal';
import History from './components/History';
import { api, Task, User, DashboardStats } from './services';

type Tab = 'dashboard' | 'tasks' | 'settings' | 'history';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [taskFilter, setTaskFilter] = useState<'Pendente' | 'Concluído' | 'Atrasado'>('Pendente');
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [tasksData, statsData] = await Promise.all([
        api.getTasks(),
        api.getStats()
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const { isLoggedIn: authStatus, user: authUser } = await api.checkAuth();
      setIsLoggedIn(authStatus);
      setUser(authUser);
      
      if (authStatus) {
        await loadData();
      }
      
      setIsLoading(false);
    };
    init();
  }, [loadData]);

  const handleLogin = async (email: string) => {
    setIsActionLoading(true);
    try {
      const loggedUser = await api.login(email);
      setUser(loggedUser);
      setIsLoggedIn(true);
      await loadData();
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsActionLoading(true);
    try {
      await api.logout();
      setIsLoggedIn(false);
      setUser(null);
      setTasks([]);
      setStats(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'user_id'>) => {
    if (!user) return;
    setIsActionLoading(true);
    try {
      const newTask = await api.createTask({ ...task, user_id: user.id } as Task);
      setTasks(prev => [newTask, ...prev]);
      await loadData(); // Atualizar stats
      setIsAddingTask(false);
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const updateTask = async (updatedTask: Task) => {
    setIsActionLoading(true);
    try {
      const result = await api.updateTask(updatedTask);
      setTasks(prev => prev.map(t => t.id === result.id ? result : t));
      if (selectedTask?.id === result.id) setSelectedTask(result);
      await loadData(); // Atualizar stats
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setIsActionLoading(true);
    try {
      await api.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      setSelectedTask(null);
      await loadData(); // Atualizar stats
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const updateUser = async (updatedUser: User) => {
    // No mockService não temos updateUser explicitamente, mas podemos simular
    setUser(updatedUser);
    localStorage.setItem('taskflow_user', JSON.stringify(updatedUser));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest animate-pulse">
          Iniciando SubControl...
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            tasks={tasks} 
            stats={stats}
            onAddTask={() => setIsAddingTask(true)} 
            onTaskClick={setSelectedTask}
            onUpdateTask={updateTask}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onProgressClick={() => setActiveTab('history')}
          />
        );
      case 'tasks':
        return (
          <Tasks 
            tasks={tasks} 
            onTaskClick={setSelectedTask}
            onUpdateTask={updateTask}
            filter={taskFilter}
            onFilterChange={setTaskFilter}
          />
        );
      case 'history':
        return (
          <History 
            tasks={tasks}
            onTaskClick={setSelectedTask}
            onUpdateTask={updateTask}
          />
        );
      case 'settings':
        return (
          <Settings 
            user={user!} 
            onUpdateUser={updateUser} 
            onLogout={handleLogout} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user!}>
        <AnimatePresence mode="wait">
          <React.Fragment key={activeTab}>
            {renderContent()}
          </React.Fragment>
        </AnimatePresence>
      </Layout>

      {/* Overlay de Loading para ações */}
      <AnimatePresence>
        {isActionLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-[100] flex items-center justify-center"
          >
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddingTask && (
          <NewTask 
            onClose={() => setIsAddingTask(false)} 
            onAdd={addTask} 
          />
        )}
        {selectedTask && (
          <TaskModal 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)} 
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        )}
      </AnimatePresence>
    </>
  );
}
