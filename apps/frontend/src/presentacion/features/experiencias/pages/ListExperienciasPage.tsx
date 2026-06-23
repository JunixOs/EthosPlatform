import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExperiencias } from '../hooks/useExperiencias';

export function ListExperienciasPage() {
  const [page, setPage] = useState(1);
  const { experiencias, total, loading, error } = useExperiencias(page);
  const totalPages = Math.ceil(total / 10);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500">{error}</div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Experiencias éticas</h1>
        <Link
          to="/experiencias/nueva"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Compartir experiencia
        </Link>
      </div>

      {experiencias.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          <p className="text-xl mb-4">Aún no hay experiencias publicadas.</p>
          <Link to="/experiencias/nueva" className="text-indigo-600 hover:underline">
            Sé el primero en compartir
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {experiencias.map((exp) => (
              <Link
                key={exp.id}
                to={`/experiencias/${exp.id}`}
                className="block bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                    {exp.titulo}
                  </h2>
                  <span className={`ml-2 shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
                    exp.estado === 'publicada'
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {exp.estado}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                  {exp.descripcion}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                    <p className="text-xs font-medium text-purple-700 dark:text-purple-400 mb-1">¿Qué dice la moral?</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{exp.reflexionMoral}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">¿Qué dice tu ética?</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{exp.reflexionEtica}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                  {new Date(exp.creadaEn).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
