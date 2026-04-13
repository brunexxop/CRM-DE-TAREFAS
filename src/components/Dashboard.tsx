import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '../types';

interface DashboardProps {
  tasks: Task[];
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  onProgressClick: () => void;
}

export default function Dashboard({ 
  tasks, 
  onAddTask, 
  onTaskClick, 
  onUpdateTask,
  selectedDate, 
  onSelectDate, 
  onProgressClick 
}: DashboardProps) {
  const [viewDate, setViewDate] = useState(new Date());

  const completedTasksCount = tasks.filter(t => t.status === 'Concluído').length;
  const dailyProgress = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;
  
  const upcomingTasks = tasks.filter(t => {
    if (t.status === 'Concluído') return false;
    if (selectedDate) {
      return t.deadline === selectedDate;
    }
    return true;
  }).slice(0, 5);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty slots for days of previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <button
          key={day}
          onClick={() => onSelectDate(isSelected ? null : dateStr)}
          className={`h-10 w-full flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
            isSelected 
              ? 'bg-primary text-on-primary shadow-lg scale-110 z-10' 
              : isToday
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'hover:bg-surface-container-highest text-on-surface-variant'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(viewDate.getMonth() + offset);
    setViewDate(newDate);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(parseInt(e.target.value));
    setViewDate(newDate);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(parseInt(e.target.value));
    setViewDate(newDate);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <section onClick={onProgressClick} className="cursor-pointer">
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden border border-white/5 hover:border-primary/30 transition-all">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/20 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <p className="text-on-surface-variant font-medium text-xs uppercase tracking-wider mb-1">VISÃO GERAL</p>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-4">
              {tasks.filter(t => t.status !== 'Concluído').length} tarefas pendentes
            </h1>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-secondary">
                <span className="uppercase tracking-widest">Progresso Semanal</span>
                <span>{dailyProgress}%</span>
              </div>
              <div className="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${dailyProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-secondary to-tertiary"
                ></motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-on-surface tracking-tight">Cronograma</h2>
            <div className="flex items-center gap-2">
              <select 
                value={viewDate.getMonth()} 
                onChange={handleMonthChange}
                className="bg-surface-container-highest border-0 rounded-lg px-2 py-1 text-xs font-bold text-primary focus:ring-1 focus:ring-primary"
              >
                {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
              <select 
                value={viewDate.getFullYear()} 
                onChange={handleYearChange}
                className="bg-surface-container-highest border-0 rounded-lg px-2 py-1 text-xs font-bold text-primary focus:ring-1 focus:ring-primary"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-surface-container-highest rounded-full transition-colors">
              <ChevronLeft size={20} className="text-primary" />
            </button>
            <span className="font-bold text-on-surface">
              {months[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-surface-container-highest rounded-full transition-colors">
              <ChevronRight size={20} className="text-primary" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
              <span key={`${d}-${i}`} className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>

          {selectedDate && (
            <div className="flex justify-center pt-2">
              <button 
                onClick={() => onSelectDate(null)}
                className="text-xs font-bold text-primary uppercase tracking-widest hover:opacity-80"
              >
                Limpar Filtro de Data
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Tasks */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-on-surface tracking-tight">
          {selectedDate ? `Tarefas para ${selectedDate.split('-').reverse().join('/')}` : 'Próximas Tarefas'}
        </h2>
        <div className="space-y-4">
          {upcomingTasks.length > 0 ? upcomingTasks.map((task) => (
            <div 
              key={task.id}
              onClick={() => onTaskClick(task)}
              className={`group flex flex-col bg-surface-container-low rounded-[2rem] p-5 transition-all duration-300 hover:bg-surface-container-high cursor-pointer border-l-4 ${
                task.priority === 'Crítico' ? 'border-error' : 
                task.priority === 'Alta' ? 'border-error/50' : 
                task.status === 'Em Andamento' ? 'border-tertiary' : 'border-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                    task.priority === 'Alta' ? 'bg-error-container text-error' : 
                    task.status === 'Em Andamento' ? 'bg-tertiary-container text-tertiary' : 
                    'bg-surface-variant text-on-surface-variant'
                  }`}>
                    {task.priority === 'Alta' ? 'ALTA PRIORIDADE' : task.status === 'Em Andamento' ? 'EM ANDAMENTO' : 'PLANEJAMENTO'}
                  </span>
                  <h3 className="text-lg font-bold text-on-surface leading-tight">{task.title}</h3>
                </div>
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
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  {task.time ? <Clock size={14} /> : <CalendarIcon size={14} />}
                  <span className="text-xs font-semibold">{task.time || `Prazo: ${task.deadline}`}</span>
                </div>
                {task.assignees && (
                  <div className="flex -space-x-2">
                    {task.assignees.map((avatar, idx) => (
                      <img 
                        key={idx} 
                        src={avatar} 
                        alt="Assignee" 
                        className="w-7 h-7 rounded-full border-2 border-surface-container-low" 
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )) : (
            <div className="p-8 text-center bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/30">
              <p className="text-on-surface-variant text-sm italic">Nenhuma tarefa pendente para este período.</p>
            </div>
          )}
        </div>
      </section>

      {/* FAB */}
      <button 
        onClick={onAddTask}
        className="fixed bottom-28 right-6 w-16 h-16 flex items-center justify-center bg-gradient-to-br from-secondary to-tertiary rounded-2xl shadow-2xl shadow-secondary/30 active:scale-90 transition-transform duration-200 z-50"
      >
        <Plus size={32} className="text-on-secondary font-bold" />
      </button>
    </motion.div>
  );
}
