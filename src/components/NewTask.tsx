import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Search, PlusCircle, Calendar, ChevronDown, Lightbulb } from 'lucide-react';
import { User, Priority, Task } from '../services';

interface NewTaskProps {
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'user_id'>) => void;
}

export default function NewTask({ onClose, onAdd }: NewTaskProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Média');
  const [deadline, setDeadline] = useState('');

  const handleCreate = () => {
    if (!title.trim()) return;
    onAdd({
      title,
      description,
      priority,
      status: 'Pendente',
      deadline,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      className="fixed inset-0 z-[100] bg-background flex flex-col"
    >
      {/* Header */}
      <header className="w-full sticky top-0 bg-background/80 backdrop-blur-xl z-50 border-b border-outline-variant/10">
        <div className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="text-primary hover:opacity-80 transition-opacity active:scale-95"
            >
              <X size={24} />
            </button>
            <h1 className="text-primary font-extrabold text-xl tracking-tight">Nova Tarefa</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-primary hover:opacity-80 transition-opacity active:scale-95">
              <Search size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto px-6 py-8 overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-32">
          {/* Main Content Area */}
          <div className="md:col-span-8 flex flex-col gap-8">
            {/* Title & Description Section */}
            <section className="glass-card p-8 rounded-xl border-t border-white/10">
              <div className="flex flex-col gap-6">
                <div className="group">
                  <label className="text-sm font-bold text-primary mb-2 block uppercase tracking-widest opacity-80">Título da Tarefa</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-surface-container-lowest border-0 rounded-xl px-4 py-4 text-lg focus:ring-2 focus:ring-primary text-on-surface placeholder-on-surface-variant/30 transition-all" 
                    placeholder="Ex: Finalizar proposta comercial" 
                  />
                </div>
                <div className="group">
                  <label className="text-sm font-bold text-primary mb-2 block uppercase tracking-widest opacity-80">Descrição Detalhada</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-surface-container-lowest border-0 rounded-xl px-4 py-4 text-base focus:ring-2 focus:ring-primary text-on-surface placeholder-on-surface-variant/30 transition-all resize-none" 
                    placeholder="Descreva os objetivos e requisitos desta tarefa..." 
                    rows={6}
                  ></textarea>
                </div>
              </div>
            </section>

            {/* Action Button */}
            <div className="flex justify-end">
              <button 
                onClick={handleCreate}
                disabled={!title.trim()}
                className="bg-gradient-to-r from-secondary to-tertiary text-on-secondary px-8 py-4 rounded-xl font-extrabold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar Tarefa
                <PlusCircle size={24} />
              </button>
            </div>
          </div>

          {/* Contextual Sidebar */}
          <aside className="md:col-span-4 flex flex-col gap-6">
            {/* Parameters Card */}
            <div className="bg-surface-container-high p-6 rounded-xl flex flex-col gap-6">
              <h2 className="text-on-surface font-extrabold text-lg tracking-tight">Parâmetros</h2>
              
              {/* Deadline Picker */}
              <div>
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2 block">Prazo Final</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-surface-container-lowest border-0 rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary cursor-pointer" 
                  />
                  <Calendar size={20} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
                </div>
              </div>

              {/* Priority Selector */}
              <div>
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2 block">Prioridade</label>
                <div className="flex bg-surface-container-lowest p-1 rounded-xl">
                  {(['Baixa', 'Média', 'Alta', 'Crítico'] as Priority[]).map((p) => (
                    <button 
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                        priority === p ? 'bg-surface-variant text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Helper Tip Card */}
            <div className="p-6 rounded-xl border border-outline-variant/20 bg-primary-container/10">
              <div className="flex gap-3 items-start">
                <Lightbulb size={24} className="text-primary" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-primary uppercase">Dica do Sistema</span>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Definir uma prioridade ajuda o TaskFlow a organizar sua agenda de amanhã automaticamente.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </motion.div>
  );
}
