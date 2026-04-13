import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Settings from './components/Settings';
import NewTask from './components/NewTask';
import Login from './components/Login';
import TaskModal from './components/TaskModal';
import History from './components/History';
import { Task, User } from './types';

type Tab = 'dashboard' | 'tasks' | 'settings' | 'history';

const DEFAULT_USER: User = {
  id: 'local-user',
  name: 'Usuário Local',
  email: 'usuario@exemplo.com',
  avatar: 'https://picsum.photos/seed/user/200'
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [taskFilter, setTaskFilter] = useState<'Pendente' | 'Concluído' | 'Atrasado'>('Pendente');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Tentar carregar dados do localStorage
      const savedTasks = localStorage.getItem('taskflow_tasks');
      const savedUser = localStorage.getItem('taskflow_user');
      const savedAuth = localStorage.getItem('taskflow_auth');

      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedAuth === 'true') setIsLoggedIn(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Persistir dados no localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
      localStorage.setItem('taskflow_user', JSON.stringify(user));
      localStorage.setItem('taskflow_auth', isLoggedIn ? 'true' : 'false');
    }
  }, [tasks, user, isLoggedIn, isLoading]);

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setUser({
      ...user,
      email,
      name: email.split('@')[0]
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('taskflow_auth');
  };

  const addTask = (task: Omit<Task, 'id' | 'user_id'>) => {
    const newTask: Task = { 
      ...task, 
      id: Math.random().toString(36).substr(2, 9),
      user_id: user.id
    } as Task;
    setTasks([newTask, ...tasks]);
    setIsAddingTask(false);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    if (selectedTask?.id === updatedTask.id) setSelectedTask(updatedTask);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    setSelectedTask(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
            user={user} 
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
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user}>
        <AnimatePresence mode="wait">
          <React.Fragment key={activeTab}>
            {renderContent()}
          </React.Fragment>
        </AnimatePresence>
      </Layout>

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
