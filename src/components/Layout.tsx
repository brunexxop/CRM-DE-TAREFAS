import React from 'react';
import { LayoutDashboard, ClipboardList, Settings, Search, History } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'tasks' | 'settings' | 'history';
  setActiveTab: (tab: 'dashboard' | 'tasks' | 'settings' | 'history') => void;
  user: User;
}

export default function Layout({ children, activeTab, setActiveTab, user }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface pb-32">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/20">
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-primary font-extrabold text-2xl uppercase tracking-tighter">CRM de tarefas</span>
          </div>
          <button className="text-primary hover:opacity-80 transition-opacity active:scale-95">
            <Search size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6 max-w-5xl mx-auto">
        {children}
      </main>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-8 pt-4 bg-surface-container-low/80 backdrop-blur-xl z-50 rounded-t-[32px] border-t border-outline-variant/20 shadow-2xl">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-200 active:scale-90 ${
            activeTab === 'dashboard' ? 'bg-primary-container text-tertiary' : 'text-on-surface-variant'
          }`}
        >
          <LayoutDashboard size={22} fill={activeTab === 'dashboard' ? 'currentColor' : 'none'} />
          <span className="font-bold text-[9px] uppercase tracking-widest mt-1">Home</span>
        </button>

        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-200 active:scale-90 ${
            activeTab === 'tasks' ? 'bg-primary-container text-tertiary' : 'text-on-surface-variant'
          }`}
        >
          <ClipboardList size={22} fill={activeTab === 'tasks' ? 'currentColor' : 'none'} />
          <span className="font-bold text-[9px] uppercase tracking-widest mt-1">Tarefas</span>
        </button>

        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-200 active:scale-90 ${
            activeTab === 'history' ? 'bg-primary-container text-tertiary' : 'text-on-surface-variant'
          }`}
        >
          <History size={22} fill={activeTab === 'history' ? 'currentColor' : 'none'} />
          <span className="font-bold text-[9px] uppercase tracking-widest mt-1">Histórico</span>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-200 active:scale-90 ${
            activeTab === 'settings' ? 'bg-primary-container text-tertiary' : 'text-on-surface-variant'
          }`}
        >
          <Settings size={22} fill={activeTab === 'settings' ? 'currentColor' : 'none'} />
          <span className="font-bold text-[9px] uppercase tracking-widest mt-1">Ajustes</span>
        </button>
      </nav>
    </div>
  );
}
