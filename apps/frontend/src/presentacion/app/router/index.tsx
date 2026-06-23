import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../../shared/components/Layout';
import { ProtectedRoute } from '../../shared/components/ProtectedRoute';
import { HomePage } from '../../pages/HomePage';
import { TeamPage } from '../../pages/TeamPage';
import { NotFoundPage } from '../../pages/NotFoundPage';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { RegisterPage } from '../../features/auth/pages/RegisterPage';
import { ListExperienciasPage } from '../../features/experiencias/pages/ListExperienciasPage';
import { ExperienciaDetailPage } from '../../features/experiencias/pages/ExperienciaDetailPage';
import { CreateExperienciaPage } from '../../features/experiencias/pages/CreateExperienciaPage';
import { EditExperienciaPage } from '../../features/experiencias/pages/EditExperienciaPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/equipo', element: <TeamPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/registro', element: <RegisterPage /> },
      { path: '/experiencias', element: <ListExperienciasPage /> },
      { path: '/experiencias/:id', element: <ExperienciaDetailPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/experiencias/nueva', element: <CreateExperienciaPage /> },
          { path: '/experiencias/:id/editar', element: <EditExperienciaPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
