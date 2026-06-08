import { create } from 'zustand';
import type { UsuarioSession } from '../types/auth.types';

interface AuthState {
  usuario: UsuarioSession | null;
  token: string | null;
  setAuth: (usuario: UsuarioSession, token: string) => void;
  logout: () => void;
}

function loadFromStorage(): { usuario: UsuarioSession | null; token: string | null } {
  const token = localStorage.getItem('ethos_token');
  const raw = localStorage.getItem('ethos_usuario');
  if (!token || !raw) return { usuario: null, token: null };
  try {
    return { usuario: JSON.parse(raw) as UsuarioSession, token };
  } catch {
    return { usuario: null, token: null };
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...loadFromStorage(),

  setAuth: (usuario, token) => {
    localStorage.setItem('ethos_token', token);
    localStorage.setItem('ethos_usuario', JSON.stringify(usuario));
    set({ usuario, token });
  },

  logout: () => {
    localStorage.removeItem('ethos_token');
    localStorage.removeItem('ethos_usuario');
    set({ usuario: null, token: null });
  },
}));
