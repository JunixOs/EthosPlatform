import { useState, useEffect, type SubmitEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { respuestasService, type Respuesta } from '@features/respuestas/services/respuestas.service';
import { useAuthStore } from '@/app/store/auth.store';

interface RespuestasSectionProps {
  experienciaId: string;
}

export function RespuestasSection({ experienciaId }: Readonly<RespuestasSectionProps>) {
  const { usuario } = useAuthStore();
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [nuevaRespuesta, setNuevaRespuesta] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await respuestasService.listar(experienciaId);
      setRespuestas(res.data);
      setTotal(res.total);
    } catch {
      setError('Error al cargar respuestas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-experienciaId-change, intentional
    void cargar();
  }, [experienciaId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!nuevaRespuesta.trim()) return;
    setEnviando(true);
    setError(null);
    try {
      const respuesta = await respuestasService.crear(experienciaId, nuevaRespuesta.trim());
      setRespuestas((prev) => [respuesta, ...prev]);
      setTotal((prev) => prev + 1);
      setNuevaRespuesta('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al enviar');
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Eliminar esta respuesta?')) return;
    try {
      await respuestasService.eliminar(id);
      setRespuestas((prev) => prev.filter((r) => r.id !== id));
      setTotal((prev) => prev - 1);
    } catch {
      alert('Error al eliminar');
    }
  };

  let listado: ReactNode;
  if (loading) {
    listado = (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  } else if (respuestas.length === 0) {
    listado = <p className="text-sm text-gray-500 dark:text-gray-400 py-4">No hay respuestas aún. Sé el primero en responder.</p>;
  } else {
    listado = (
      <div className="space-y-4">
        {respuestas.map((r) => {
          const isAuthor = usuario?.id === r.usuarioId;
          return (
            <div
              key={r.id}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap flex-1">
                  {r.contenido}
                </p>
                {isAuthor && (
                  <button
                    onClick={() => handleEliminar(r.id)}
                    className="ml-3 text-xs text-red-500 hover:text-red-600 shrink-0"
                    title="Eliminar"
                  >
                    Eliminar
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(r.creadaEn).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <section className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Respuestas ({total})
      </h2>

      {/* Formulario */}
      {usuario ? (
        <form onSubmit={handleSubmit} className="mb-6">
          {error && (
            <div className="mb-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm rounded-md px-4 py-2">
              {error}
            </div>
          )}
          <textarea
            value={nuevaRespuesta}
            onChange={(e) => setNuevaRespuesta(e.target.value)}
            placeholder="Escribe tu respuesta..."
            rows={3}
            maxLength={2000}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">{nuevaRespuesta.length}/2000</span>
            <button
              type="submit"
              disabled={enviando || !nuevaRespuesta.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-md text-sm transition-colors"
            >
              {enviando ? 'Enviando...' : 'Responder'}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">Inicia sesión</Link> para responder.
        </p>
      )}

      {/* Listado */}
      {listado}
    </section>
  );
}
