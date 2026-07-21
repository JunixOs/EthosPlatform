import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';

export function ProtectedRoute() {
  const { usuario, isTokenExpired, logout } = useAuthStore();

  if (usuario && isTokenExpired()) {
    logout();
    return <Navigate to="/login?sesionExpirada=1" replace />;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
