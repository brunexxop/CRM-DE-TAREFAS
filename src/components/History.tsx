import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Clock, Calendar } from 'lucide-react';
import { Task } from '../services';

interface HistoryProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
}

export default function History({ tasks, onTaskClick, onUpdateTask }: HistoryProps) {
  const pendingTasks = tasks.filter(t => t.status !== 'Concluído');
  const completedTasks = tasks.filter(t => t.status === 'Concluído');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <section>
        <h2 className="text-on-surface font-extrabold text-4xl tracking-tight mb-2">Histórico</h2>
        <p className="text-on-surface-variant">Todas as suas tarefas organizadas por status.</p>
      </section>

      {/* Pending Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Clock size={20} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold text-on-surface">Tarefas em Aberto</h3>
          <span className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full text-xs font-bold">
            {pendingTasks.length}
          </span>
        </div>
        
        <div className="space-y-3">
          {pendingTasks.length > 0 ? (
            pendingTasks.map((task) => (
              <div 
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all cursor-pointer flex items-center gap-4 group"
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
                  <h4 className="font-bold text-on-surface">{task.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {task.priority}
                    </span>
                    <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                      <Calendar size={10} />
                      {task.deadline || task.time}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-on-surface-variant text-sm italic py-4">Nenhuma tarefa pendente.</p>
          )}
        </div>
      </section>

      {/* Completed Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-secondary/10 p-2 rounded-lg">
            <CheckCircle2 size={20} className="text-secondary" />
          </div>
          <h3 className="text-xl font-bold text-on-surface">Tarefas Finalizadas</h3>
          <span className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full text-xs font-bold">
            {completedTasks.length}
          </span>
        </div>

        <div className="space-y-3">
          {completedTasks.length > 0 ? (
            completedTasks.map((task) => (
              <div 
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="bg-surface-container-low/50 p-4 rounded-2xl border border-outline-variant/5 hover:border-secondary/30 transition-all cursor-pointer flex items-center gap-4 group opacity-70"
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
                  <h4 className="font-bold text-on-surface line-through">{task.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Concluída
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-on-surface-variant text-sm italic py-4">Nenhuma tarefa concluída ainda.</p>
          )}
        </div>
      </section>
    </motion.div>
  );
}
