export type Priority = 'Baixa' | 'Média' | 'Alta' | 'Crítico';
export type Status = 'Pendente' | 'Em Andamento' | 'Concluído' | 'Atrasado' | 'Planejamento';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  deadline?: string;
  time?: string;
  assignees?: string[];
  created_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}
