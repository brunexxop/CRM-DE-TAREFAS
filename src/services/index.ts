import { mockService } from './mockService';
import { supabaseService } from './supabaseService';

// Altere para true quando quiser usar o Supabase
const USE_SUPABASE = false;

export const api = USE_SUPABASE ? supabaseService : mockService;
export * from './types';
