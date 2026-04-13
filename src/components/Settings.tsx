import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Edit2, Bell, Palette, Globe, LogOut, ChevronRight, Save, Camera } from 'lucide-react';
import { User } from '../types';

interface SettingsProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

export default function Settings({ user, onUpdateUser, onLogout }: SettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <section>
        <h2 className="text-on-surface font-extrabold text-4xl tracking-tight mb-2">Ajustes</h2>
        <p className="text-on-surface-variant">Gerencie suas preferências e configurações de conta.</p>
      </section>

      {/* Profile Section */}
      <div className="grid grid-cols-1 gap-6">
        <section className="glass-card rounded-[24px] p-8 relative overflow-hidden border border-outline-variant/10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <img 
                src={editedUser.avatar} 
                alt="Profile" 
                className="w-32 h-32 rounded-[32px] object-cover border-4 border-primary/20"
                referrerPolicy="no-referrer"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-[32px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" size={32} />
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Nome</label>
                    <input 
                      type="text" 
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      className="w-full bg-surface-container-lowest border-0 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">URL da Foto</label>
                    <input 
                      type="text" 
                      value={editedUser.avatar}
                      onChange={(e) => setEditedUser({ ...editedUser, avatar: e.target.value })}
                      className="w-full bg-surface-container-lowest border-0 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-3xl font-bold text-on-surface mb-1">{user.name}</h3>
                  <p className="text-on-surface-variant text-lg">{user.email}</p>
                </div>
              )}

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSave}
                      className="bg-primary text-on-primary px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                    >
                      <Save size={18} />
                      Salvar
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        setEditedUser(user);
                      }}
                      className="bg-surface-container-highest text-on-surface px-6 py-3 rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-secondary-container/30 text-secondary px-6 py-3 rounded-2xl font-bold border border-secondary/20 hover:bg-secondary-container/50 transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Edit2 size={18} />
                    Editar Perfil
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications */}
        <section className="bg-surface-container-high rounded-[28px] p-8 border border-outline-variant/10 hover:border-primary/30 transition-colors group">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-surface-container-lowest p-3 rounded-2xl">
                <Bell size={24} className="text-primary" />
              </div>
              <h3 className="font-bold text-xl">Notificações</h3>
            </div>
            <ChevronRight size={24} className="text-on-surface-variant group-hover:text-primary transition-colors" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl">
              <span className="text-sm font-medium">Alertas de Tarefas</span>
              <div className="w-10 h-6 bg-tertiary rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-on-tertiary rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Interface */}
        <section className="bg-surface-container-high rounded-[28px] p-8 border border-outline-variant/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-surface-container-lowest p-3 rounded-2xl">
                <Palette size={24} className="text-secondary" />
              </div>
              <h3 className="font-bold text-xl">Interface</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl">
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-on-surface-variant" />
                  <span className="text-sm font-medium">Idioma</span>
                </div>
                <span className="text-primary text-xs font-bold uppercase tracking-wider">Português (BR)</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Logout */}
      <div className="pt-8 flex justify-center">
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-error px-8 py-4 rounded-2xl border border-error/20 hover:bg-error-container/20 transition-all active:scale-95 duration-150 font-bold uppercase tracking-widest text-sm"
        >
          <LogOut size={20} />
          Sair da Conta
        </button>
      </div>
    </motion.div>
  );
}
