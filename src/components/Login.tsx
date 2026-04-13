import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Lock, Mail, UserPlus } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay de rede
    setTimeout(() => {
      setIsLoading(false);
      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
      onLogin(email);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 rounded-[32px] border border-outline-variant/10"
      >
        <div className="text-center mb-10">
          <h1 className="text-primary font-extrabold text-4xl uppercase tracking-tighter mb-2">SubControl</h1>
          <p className="text-on-surface-variant">
            {isSignUp ? 'Crie sua conta local para começar' : 'Entre localmente para continuar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-lowest border-0 rounded-2xl pl-12 pr-4 py-4 text-on-surface focus:ring-2 focus:ring-primary transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-lowest border-0 rounded-2xl pl-12 pr-4 py-4 text-on-surface focus:ring-2 focus:ring-primary transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-error text-sm font-medium text-center">{error}</p>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-secondary to-tertiary text-on-secondary py-4 rounded-2xl font-extrabold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Carregando...' : (isSignUp ? 'Cadastrar' : 'Entrar')}
            {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
          </button>

          <div className="text-center">
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-bold text-sm hover:underline"
            >
              {isSignUp ? 'Já tem uma conta? Entre aqui' : 'Não tem uma conta? Cadastre-se'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
