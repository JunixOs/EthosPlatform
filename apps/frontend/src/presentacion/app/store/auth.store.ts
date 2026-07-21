import { create } from 'zustand';

export interface UsuarioSession {
  id: string;
  nombre: string;
  rol: string;
}

export interface AuthState {
  usuario: UsuarioSession | null;
  token: string | null;
  expiresAt: string | null;
  setAuth: (usuario: UsuarioSession, token: string, expiresAt: string) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
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

function checkExpired(expiresAt: string | null): boolean {
  if (!expiresAt || expiresAt === 'undefined' || expiresAt === 'null') return true;
  try {
    const exp = new Date(expiresAt).getTime();
    if (Number.isNaN(exp)) return true;
    return Date.now() >= exp;
  } catch {
    return true;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
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

  isTokenExpired: () => {
    return checkExpired(get().expiresAt);
  },
}));

// Sincronizar logout entre pestañas / cuando api.ts limpia localStorage
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'ethos_token' && e.newValue === null) {
      useAuthStore.setState({ usuario: null, token: null, expiresAt: null });
    }
  });

  window.addEventListener('ethos:auth:expired', () => {
    useAuthStore.setState({ usuario: null, token: null, expiresAt: null });
  });
}
