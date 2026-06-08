import { useState } from 'react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import type { LoginDTO, RegisterDTO } from '../types/auth.types';

export function useAuth() {
  const { setAuth, logout: storeLogout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginDTO): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.login(data);
      setAuth({ id: result.usuarioId, nombre: result.nombre, rol: result.rol }, result.token);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al iniciar sesión');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterDTO): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(data);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al registrarse');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      storeLogout();
    }
  };

  return { login, register, logout, loading, error };
}
