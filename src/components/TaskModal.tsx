import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Clock, Calendar, Trash2, CheckCircle2, AlertCircle, Edit3 } from 'lucide-react';
import { Task, Priority, Status } from '../types';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskModal({ task, onClose, onUpdate, onDelete }: TaskModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  const toggleStatus = () => {
    const newStatus: Status = editedTask.status === 'Concluído' ? 'Pendente' : 'Concluído';
    const updated = { ...editedTask, status: newStatus };
    setEditedTask(updated);
    onUpdate(updated);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-background/80 backdrop-blur-sm flex items-center justify-center px-6"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-lg glass-card rounded-[32px] border border-outline-variant/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              editedTask.priority === 'Crítico' ? 'bg-error-container text-error' : 
              editedTask.priority === 'Alta' ? 'bg-error-container/50 text-error' : 
              'bg-surface-variant text-on-surface-variant'
            }`}>
              {editedTask.priority}
            </span>
            {editedTask.status === 'Concluído' && (
              <span className="bg-tertiary-container text-tertiary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <CheckCircle2 size={10} />
                Concluído
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <input 
                type="text" 
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="w-full bg-surface-container-lowest border-0 rounded-xl px-4 py-3 text-xl font-bold text-on-surface focus:ring-2 focus:ring-primary"
              />
              <textarea 
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                className="w-full bg-surface-container-lowest border-0 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary resize-none"
                rows={4}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-primary uppercase tracking-widest mb-1 block">Prioridade</label>
                  <select 
                    value={editedTask.priority}
                    onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Priority })}
                    className="w-full bg-surface-container-lowest border-0 rounded-xl px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítico">Crítico</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-primary uppercase tracking-widest mb-1 block">Status</label>
                  <select 
                    value={editedTask.status}
                    onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as Status })}
                    className="w-full bg-surface-container-lowest border-0 rounded-xl px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Atrasado">Atrasado</option>
                    <option value="Planejamento">Planejamento</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-bold text-on-surface mb-2">{editedTask.title}</h2>
                <p className="text-on-surface-variant leading-relaxed">{editedTask.description}</p>
              </div>

              <div className="flex flex-wrap gap-6 py-4 border-y border-outline-variant/10">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Clock size={18} className="text-primary" />
                  <span className="text-sm font-medium">{editedTask.time || 'Sem horário'}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Calendar size={18} className="text-secondary" />
                  <span className="text-sm font-medium">{editedTask.deadline || 'Sem prazo'}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-surface-container-low/50 flex items-center justify-between gap-4">
          <div className="flex gap-3">
            <button 
              onClick={() => onDelete(task.id)}
              className="p-3 rounded-2xl bg-error-container/20 text-error hover:bg-error-container/40 transition-all active:scale-95"
              title="Excluir Tarefa"
            >
              <Trash2 size={20} />
            </button>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`p-3 rounded-2xl transition-all active:scale-95 ${
                isEditing ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface'
              }`}
              title="Editar Tarefa"
            >
              <Edit3 size={20} />
            </button>
          </div>

          <div className="flex gap-3">
            {isEditing ? (
              <button 
                onClick={handleSave}
                className="bg-primary text-on-primary px-6 py-3 rounded-2xl font-bold transition-all hover:opacity-90 active:scale-95"
              >
                Salvar Alterações
              </button>
            ) : (
              <button 
                onClick={toggleStatus}
                className={`px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 flex items-center gap-2 ${
                  editedTask.status === 'Concluído' 
                    ? 'bg-surface-container-highest text-on-surface' 
                    : 'bg-gradient-to-r from-secondary to-tertiary text-on-secondary'
                }`}
              >
                {editedTask.status === 'Concluído' ? 'Marcar como Pendente' : 'Concluir Tarefa'}
                {editedTask.status !== 'Concluído' && <CheckCircle2 size={20} />}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
