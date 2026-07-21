import { Link } from 'react-router-dom';

export function ForbiddenPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">🚫</div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Acceso denegado
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        No tienes los permisos necesarios para acceder a esta sección.
        Si crees que esto es un error, contacta al administrador.
      </p>
      <div className="flex gap-3">
        <Link
          to="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          Ir al inicio
        </Link>
        <Link
          to="/experiencias"
          className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Ver experiencias
        </Link>
      </div>
    </div>
  );
}
