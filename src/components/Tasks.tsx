import React from 'react';
import { motion } from 'motion/react';
import { Clock, MoreVertical, ChevronRight, CheckCircle, CalendarX } from 'lucide-react';
import { Task } from '../services';

interface TasksProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  filter: 'Pendente' | 'Concluído' | 'Atrasado';
  onFilterChange: (filter: 'Pendente' | 'Concluído' | 'Atrasado') => void;
}

export default function Tasks({ tasks, onTaskClick, onUpdateTask, filter, onFilterChange }: TasksProps) {
  const filteredTasks = tasks.filter(t => {
    if (filter === 'Pendente') return t.status === 'Pendente' || t.status === 'Em Andamento';
    if (filter === 'Concluído') return t.status === 'Concluído';
    if (filter === 'Atrasado') {
      // Logic for overdue: simplified for demo
      return t.status !== 'Concluído' && t.deadline && new Date(t.deadline) < new Date();
    }
    return true;
  });

  const completedTasksCount = tasks.filter(t => t.status === 'Concluído').length;
  const progress = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;
  
  const criticalTask = filteredTasks.find(t => t.priority === 'Crítico') || filteredTasks[0];
  const otherTasks = filteredTasks.filter(t => t.id !== criticalTask?.id);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      {/* Tabs */}
      <nav className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        <button 
          onClick={() => onFilterChange('Pendente')}
          className={`px-6 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            filter === 'Pendente' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high/50 text-on-surface-variant'
          }`}
        >
          <Clock size={16} />
          Pendente
        </button>
        <button 
          onClick={() => onFilterChange('Concluído')}
          className={`px-6 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            filter === 'Concluído' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high/50 text-on-surface-variant'
          }`}
        >
          <CheckCircle size={16} />
          Concluído
        </button>
        <button 
          onClick={() => onFilterChange('Atrasado')}
          className={`px-6 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            filter === 'Atrasado' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high/50 text-on-surface-variant'
          }`}
        >
          <CalendarX size={16} />
          Atrasado
        </button>
      </nav>

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">
            {filter === 'Pendente' ? 'Pendente Hoje' : filter === 'Concluído' ? 'Finalizadas' : 'Atrasadas'}
          </h2>
          <p className="text-on-surface-variant text-sm">Você tem {filteredTasks.length} tarefas nesta categoria.</p>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Critical Task */}
        {criticalTask && (
          <div 
            onClick={() => onTaskClick(criticalTask)}
            className="md:col-span-8 glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5 cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl -mr-16 -mt-16"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="relative inline-flex items-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateTask({
                      ...criticalTask,
                      status: criticalTask.status === 'Concluído' ? 'Pendente' : 'Concluído'
                    });
                  }}
                >
                  <div className={`w-11 h-6 rounded-full transition-all ${criticalTask.status === 'Concluído' ? 'bg-secondary' : 'bg-surface-container-highest'}`}>
                    <div className={`absolute top-[2px] start-[2px] bg-white rounded-full h-5 w-5 transition-all ${criticalTask.status === 'Concluído' ? 'translate-x-full' : ''}`}></div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                  criticalTask.priority === 'Crítico' ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'
                }`}>
                  {criticalTask.priority}
                </span>
              </div>
              <button className="text-on-surface-variant hover:text-on-surface"><MoreVertical size={20} /></button>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{criticalTask.title}</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6 max-w-lg line-clamp-2">{criticalTask.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {criticalTask.assignees?.map((avatar, idx) => (
                  <img key={idx} className="w-8 h-8 rounded-full border-2 border-surface-container-high object-cover" src={avatar} alt="User" referrerPolicy="no-referrer" />
                ))}
              </div>
              <span className="text-xs text-on-surface-variant flex items-center gap-1">
                <Clock size={14} />
                {criticalTask.time || criticalTask.deadline || 'Pendente'}
              </span>
            </div>
          </div>
        )}

        {/* Weekly Progress */}
        <div className="md:col-span-4 glass-card p-6 rounded-3xl flex flex-col justify-between border border-white/5">
          <div>
            <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Progresso Semanal</h4>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-4xl font-extrabold text-tertiary">{progress}%</span>
              <span className="text-sm text-on-surface-variant mb-1">Concluído</span>
            </div>
            <div className="w-full h-2 bg-surface-container-lowest rounded-full mt-4">
              <div className="h-full bg-gradient-to-r from-secondary to-tertiary rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant mt-4">Excelente ritmo! Você completou {completedTasksCount} tarefas até agora.</p>
        </div>

        {/* Other Tasks */}
        {otherTasks.map((task) => (
          <div 
            key={task.id} 
            onClick={() => onTaskClick(task)}
            className="md:col-span-6 bg-surface-container-low/50 backdrop-blur-md p-5 rounded-2xl hover:bg-surface-container-high transition-all flex items-center gap-4 group border border-white/5 cursor-pointer"
          >
            <div 
              className="relative inline-flex items-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateTask({
                  ...task,
                  status: task.status === 'Concluído' ? 'Pendente' : 'Concluído'
                });
              }}
            >
              <div className={`w-11 h-6 rounded-full transition-all ${task.status === 'Concluído' ? 'bg-secondary' : 'bg-surface-container-highest'}`}>
                <div className={`absolute top-[2px] start-[2px] bg-white rounded-full h-5 w-5 transition-all ${task.status === 'Concluído' ? 'translate-x-full' : ''}`}></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold group-hover:text-primary transition-colors">{task.title}</h4>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${
                  task.priority === 'Alta' ? 'bg-error-container/50 text-error' : 
                  task.priority === 'Média' ? 'bg-secondary-container text-on-secondary-container' : 
                  'bg-tertiary-container text-on-tertiary-container'
                }`}>
                  {task.priority}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant line-clamp-1">{task.description}</p>
            </div>
            <ChevronRight size={20} className="text-on-surface-variant group-hover:text-primary transition-colors" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
