import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { useTheme } from '../hooks/useTheme';

export function Navbar() {
  const { usuario, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          EthosPlatform
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/experiencias" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
            Experiencias
          </Link>
          <Link to="/buscar" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
            Buscar
          </Link>
          <Link to="/equipo" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
            Equipo
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {usuario ? (
            <div className="flex items-center gap-3">
              <Link
                to="/experiencias/nueva"
                className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-indigo-700"
              >
                + Nueva
              </Link>
              <Link
                to="/favoritos"
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-500"
                title="Mis favoritos"
              >
                ♥
              </Link>
              {/* Dropdown usuario */}
              <div className="relative group">
                <button className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400">
                  {usuario.nombre}
                  <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link to={`/perfil/${usuario.id}`}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                    Mi perfil
                  </Link>
                  <Link to="/perfil/editar"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                    Editar perfil
                  </Link>
                  <Link to="/favoritos"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                    Mis favoritos
                  </Link>
                  {usuario.rol === 'admin' && (
                    <Link to="/admin/usuarios"
                      className="block px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 font-medium">
                      Panel admin
                    </Link>
                  )}
                  <hr className="my-1 border-gray-100 dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-indigo-700"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
