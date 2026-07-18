import { create } from 'zustand';

export interface UsuarioSession {
  id: string;
  nombre: string;
  rol: string;
}

interface AuthState {
  usuario: UsuarioSession | null;
  token: string | null;
  expiresAt: string | null;
  setAuth: (usuario: UsuarioSession, token: string, expiresAt: string) => void;
  logout: () => void;
}

function loadFromStorage(): { usuario: UsuarioSession | null; token: string | null ; expiresAt: string | null} {
  const token = localStorage.getItem('ethos_token');
  const raw = localStorage.getItem('ethos_usuario');
  const expiresAt = localStorage.getItem('ethos_token_expiresAt');
  if (!token || !raw || !expiresAt) return { usuario: null, token: null, expiresAt: null };
  try {
    return { usuario: JSON.parse(raw) as UsuarioSession, token, expiresAt };
  } catch {
    return { usuario: null, token: null, expiresAt: null };
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...loadFromStorage(),

  setAuth: (usuario, token, expiresAt) => {
    localStorage.setItem('ethos_token', token);
    localStorage.setItem('ethos_usuario', JSON.stringify(usuario));
    localStorage.setItem('ethos_token_expiresAt', expiresAt);
    set({ usuario, token, expiresAt });
  },

  logout: () => {
    localStorage.removeItem('ethos_token');
    localStorage.removeItem('ethos_usuario');
    localStorage.removeItem('ethos_token_expiresAt');
    set({ usuario: null, token: null, expiresAt: null });
  },
}));
