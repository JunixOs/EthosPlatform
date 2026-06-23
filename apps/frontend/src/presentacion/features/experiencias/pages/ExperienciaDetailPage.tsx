import { useParams, useNavigate, Link } from 'react-router-dom';
import { useExperiencia } from '../hooks/useExperiencias';
import { useAuthStore } from '../../auth/store/auth.store';
import { experienciasService } from '../services/experiencias.service';
import { useState } from 'react';

export function ExperienciaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { experiencia, loading, error } = useExperiencia(id ?? '');
  const { usuario } = useAuthStore();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const isOwner = usuario && experiencia && usuario.id === experiencia.usuarioId;

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta experiencia?')) return;
    setDeleting(true);
    try {
      await experienciasService.delete(id ?? '');
      navigate('/experiencias');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error al eliminar');
      setDeleting(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await experienciasService.publish(id ?? '');
      navigate(0);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error al publicar');
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !experiencia) {
    return <div className="text-center py-16 text-red-500">{error ?? 'No encontrada'}</div>;
  }

  return (
    <article className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/experiencias" className="text-sm text-gray-500 hover:text-indigo-600">
          ← Volver
        </Link>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          experiencia.estado === 'publicada'
            ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
            : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400'
        }`}>
          {experiencia.estado}
        </span>
        {isOwner && (
          <div className="ml-auto flex gap-2">
            {experiencia.estado === 'borrador' && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md disabled:opacity-50"
              >
                {publishing ? 'Publicando...' : 'Publicar'}
              </button>
            )}
            <Link
              to={`/experiencias/${experiencia.id}/editar`}
              className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded-md"
            >
              Editar
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 px-3 py-1.5 rounded-md disabled:opacity-50"
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-2">{experiencia.titulo}</h1>
      <p className="text-gray-400 dark:text-gray-500 text-sm mb-8">
        {new Date(experiencia.creadaEn).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Descripción</h2>
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{experiencia.descripcion}</p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide mb-3">
            ¿Qué dice la moral?
          </h2>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{experiencia.reflexionMoral}</p>
        </section>

        <section className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-3">
            ¿Qué dice tu ética?
          </h2>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{experiencia.reflexionEtica}</p>
        </section>
      </div>
    </article>
  );
}
