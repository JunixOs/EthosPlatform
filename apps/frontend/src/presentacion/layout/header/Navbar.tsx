import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegSun, FaRegMoon } from 'react-icons/fa';
import {  } from "react-icons/fa";

import { useAuthStore } from '@features/auth/store/auth.store';
import { useTheme } from '@shared/hooks/useTheme';
import { ButtonComponent } from '@/shared/components/Button/Button.component';
import { LinkComponent } from '@/shared/components/Link/Link.component';

export function Navbar() {
  const { usuario, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navbarItems = [
    {
      to: '/experiencias',
      label: 'Experiencias'
    },
    {
      to: '/buscar',
      label: 'Buscar'
    },
    {
      to: '/equipo',
      label: 'Equipo'
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <LinkComponent
          to='/'
          variant='navbar_main'
          size='none'
          className='text-xl font-bold'>
            EthosPlatform
        </LinkComponent>

        <div className="flex items-center gap-4">
          {navbarItems.map(item => (
            <LinkComponent
              to={item.to}
              variant="navbar"
              size="none"
              className='text-sm'
              >
              {item.label}
            </LinkComponent>
          ))}

          <ButtonComponent
            variant='navbar_button'
            size='md'
            className='rounded-md'
            onClick={toggleTheme}
            aria-label="Cambiar tema">
            {theme === 'dark' ? <FaRegSun /> : <FaRegMoon />}
          </ButtonComponent>

          {usuario ? (
            <div className="flex items-center gap-3">
              <LinkComponent
                to="/experiencias/nueva"
                variant='primary_button_indigo'
                size='sm'
                className='rounded-md'>
                  + Nueva
              </LinkComponent>
              <LinkComponent
                to="/favoritos"
                variant='custom'
                size='none'
                className='text-sm text-gray-600 dark:text-gray-300 hover:text-red-500'>
                  <FaHeart />
              </LinkComponent>

              {/* Dropdown usuario */}
              <div className="relative group">
                <ButtonComponent
                  variant='dropdown'
                  size='none'
                  className='text-sm font-medium flex items-center gap-1'>
                  {usuario.nombre}
                  <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </ButtonComponent>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <LinkComponent
                    to={`/perfil/${usuario.id}`}
                    variant='dropdown'
                    size='none'
                    className='block px-4 py-2 text-sm'>
                    Mi perfil
                  </LinkComponent>
                  <LinkComponent
                    to="/perfil/editar"
                    variant='dropdown'
                    size='none'
                    className='block px-4 py-2 text-sm'>
                    Editar perfil
                  </LinkComponent>
                  {usuario.rol === 'admin' && (
                    <LinkComponent 
                      to="/admin/usuarios"
                      variant='dropdown'
                      size='none'
                      className="block px-4 py-2 text-sm font-medium">
                      Panel admin
                    </LinkComponent>
                  )}
                  <hr className="my-1 border-gray-100 dark:border-gray-700" />
                  <ButtonComponent
                    onClick={handleLogout}
                    variant='danger'
                    size='none'
                    className="w-full text-left px-4 py-2 text-sm"
                  >
                    Cerrar sesión
                  </ButtonComponent>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <LinkComponent 
                to="/login" 
                variant='navbar'
                size='sm'>
                Iniciar sesión
              </LinkComponent>
              <LinkComponent
                to="/registro"
                variant='primary_button_indigo'
                size='sm'
                className="rounded-md"
              >
                Registrarse
              </LinkComponent>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
