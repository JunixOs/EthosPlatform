import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <p className="text-8xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">404</p>
      <h1 className="text-2xl font-bold mb-2">Página no encontrada</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        to="/"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
