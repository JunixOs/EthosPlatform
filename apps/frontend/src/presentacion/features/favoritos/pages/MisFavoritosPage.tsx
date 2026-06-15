import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { favoritosService } from '../services/favoritos.service';
import type { Experiencia } from '../../experiencias/types/experiencia.types';

export function MisFavoritosPage() {
  const [favoritos, setFavoritos] = useState<Experiencia[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    favoritosService
      .getMios(page)
      .then((res) => {
        setFavoritos(res.data);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mis favoritos</h1>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
        </div>
      )}

      {!loading && favoritos.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No tienes experiencias guardadas como favoritas.</p>
          <Link to="/experiencias" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
            Explorar experiencias →
          </Link>
        </div>
      )}

      {!loading && favoritos.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {favoritos.map((exp) => (
              <Link
                key={exp.id}
                to={`/experiencias/${exp.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 flex-1">{exp.titulo}</h3>
                  <span className="ml-2 text-red-400 text-lg">♥</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{exp.descripcion}</p>
                <p className="text-xs text-gray-400">{new Date(exp.creadaEn).toLocaleDateString('es-ES')}</p>
              </Link>
            ))}
          </div>

          {/* Paginación */}
          {total > 10 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                Página {page} · {total} favoritos
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 10 >= total}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
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
