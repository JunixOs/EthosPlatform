import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/auth.store';

export function ProtectedRoute() {
  const { usuario } = useAuthStore();
  if (!usuario) return <Navigate to="/login" replace />;
  return <Outlet />;
}
