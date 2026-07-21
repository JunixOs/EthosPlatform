import { useState, useEffect, type SubmitEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { experienciasService } from '@features/experiencias/services/experiencias.service';
import type { Experiencia } from '@features/experiencias/types/experiencia.types';

export function EditExperienciaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experiencia, setExperiencia] = useState<Experiencia | null>(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [reflexionMoral, setReflexionMoral] = useState('');
  const [reflexionEtica, setReflexionEtica] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    experienciasService.getById(id ?? '')
      .then((exp) => {
        setExperiencia(exp);
        setTitulo(exp.titulo);
        setDescripcion(exp.descripcion);
        setReflexionMoral(exp.reflexionMoral);
        setReflexionEtica(exp.reflexionEtica);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await experienciasService.update(id ?? '', { titulo, descripcion, reflexionMoral, reflexionEtica });
      navigate(`/experiencias/${id ?? ''}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !experiencia) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Editar experiencia</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm rounded-md px-4 py-3">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="titulo" className="block text-sm font-medium mb-1">Título</label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            maxLength={255}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={4}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5">
          <label htmlFor="reflexionMoral" className="block text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">
            ¿Qué dice la moral?
          </label>
          <textarea
            id="reflexionMoral"
            value={reflexionMoral}
            onChange={(e) => setReflexionMoral(e.target.value)}
            required
            rows={3}
            className="w-full border border-purple-200 dark:border-purple-800 rounded-md px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5">
          <label htmlFor="reflexionEtica" className="block text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
            ¿Qué dice tu ética?
          </label>
          <textarea
            id="reflexionEtica"
            value={reflexionEtica}
            onChange={(e) => setReflexionEtica(e.target.value)}
            required
            rows={3}
            className="w-full border border-blue-200 dark:border-blue-800 rounded-md px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 rounded-md"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
