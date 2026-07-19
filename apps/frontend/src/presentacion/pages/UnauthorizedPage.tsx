import { Link } from 'react-router-dom';

export function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">🔐</div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Sesión expirada
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        Tu sesión ha expirado o no tienes permisos para acceder a esta página.
        Por favor, inicia sesión de nuevo.
      </p>
      <Link
        to="/login"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
      >
        Iniciar sesión
      </Link>
    </div>
  );
}
