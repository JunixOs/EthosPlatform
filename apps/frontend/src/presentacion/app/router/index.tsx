import { createBrowserRouter } from 'react-router-dom';

import { ProtectedRoute } from '@app/router/ProtectedRoute';
import { AdminRoute } from '@app/router/AdminRoute';

import { Layout } from '@layout/shell/Layout';
// Pages
import { HomePage } from '@pages/HomePage';
import { TeamPage } from '@pages/TeamPage';
import { NotFoundPage } from '@pages/NotFoundPage';
// Auth
import { LoginPage } from '@features/auth/pages/LoginPage';
import { RegisterPage } from '@features/auth/pages/RegisterPage';
// Experiencias
import { ListExperienciasPage } from '@features/experiencias/pages/ListExperienciasPage';
import { ExperienciaDetailPage } from '@features/experiencias/pages/ExperienciaDetailPage';
import { CreateExperienciaPage } from '@features/experiencias/pages/CreateExperienciaPage';
import { EditExperienciaPage } from '@features/experiencias/pages/EditExperienciaPage';
import { BuscarExperienciasPage } from '@features/experiencias/pages/BuscarExperienciasPage';
// Usuarios
import { PerfilPage } from '@features/usuarios/pages/PerfilPage';
import { EditarPerfilPage } from '@features/usuarios/pages/EditarPerfilPage';
// Favoritos
import { MisFavoritosPage } from '@features/favoritos/pages/MisFavoritosPage';
// Admin
import { AdminUsuariosPage } from '@features/admin/pages/AdminUsuariosPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/equipo', element: <TeamPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/registro', element: <RegisterPage /> },
      { path: '/buscar', element: <BuscarExperienciasPage /> },
      { path: '/experiencias', element: <ListExperienciasPage /> },
      { path: '/experiencias/:id', element: <ExperienciaDetailPage /> },
      { path: '/perfil/:id', element: <PerfilPage /> },

      // Rutas protegidas (requieren login)
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/experiencias/nueva', element: <CreateExperienciaPage /> },
          { path: '/experiencias/:id/editar', element: <EditExperienciaPage /> },
          { path: '/perfil/editar', element: <EditarPerfilPage /> },
          { path: '/favoritos', element: <MisFavoritosPage /> },
        ],
      },

      // Rutas solo admin
      {
        element: <AdminRoute />,
        children: [
          { path: '/admin/usuarios', element: <AdminUsuariosPage /> },
        ],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
