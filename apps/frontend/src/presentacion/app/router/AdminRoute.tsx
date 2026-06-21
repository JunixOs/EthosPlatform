import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@features/auth/store/auth.store';

export function AdminRoute() {
  const { usuario } = useAuthStore();
  if (!usuario) return <Navigate to="/login" replace />;
  if (usuario.rol !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}
