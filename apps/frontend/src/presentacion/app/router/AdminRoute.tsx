import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';

export function AdminRoute() {
  const { usuario, isTokenExpired, logout } = useAuthStore();

  if (!usuario || isTokenExpired()) {
    if (usuario && isTokenExpired()) {
      logout();
    }
    return <Navigate to="/login?sesionExpirada=1" replace />;
  }

  if (usuario.rol !== 'admin') return <Navigate to="/403" replace />;
  return <Outlet />;
}
