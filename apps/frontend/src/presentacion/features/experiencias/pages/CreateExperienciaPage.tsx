import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { experienciasService } from '../services/experiencias.service';

export function CreateExperienciaPage() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [reflexionMoral, setReflexionMoral] = useState('');
  const [reflexionEtica, setReflexionEtica] = useState('');
  const [publicar, setPublicar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await experienciasService.create({ titulo, descripcion, reflexionMoral, reflexionEtica, publicar });
      navigate(`/experiencias/${result.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Compartir experiencia ética</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm rounded-md px-4 py-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            maxLength={255}
            placeholder="¿De qué trata tu experiencia?"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={4}
            placeholder="Describe lo que ocurrió..."
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5">
          <label className="block text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">
            ¿Qué dice la moral?
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            La moral son las normas y valores que la sociedad considera correctos.
          </p>
          <textarea
            value={reflexionMoral}
            onChange={(e) => setReflexionMoral(e.target.value)}
            required
            rows={3}
            placeholder="¿Qué considerarías que la sociedad o las normas dicen sobre esto?"
            className="w-full border border-purple-200 dark:border-purple-800 rounded-md px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5">
          <label className="block text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
            ¿Qué dice tu ética?
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Tu ética es tu criterio personal y racional sobre lo que es correcto.
          </p>
          <textarea
            value={reflexionEtica}
            onChange={(e) => setReflexionEtica(e.target.value)}
            required
            rows={3}
            placeholder="¿Qué decidiste tú hacer y por qué lo consideras correcto?"
            className="w-full border border-blue-200 dark:border-blue-800 rounded-md px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="publicar"
            checked={publicar}
            onChange={(e) => setPublicar(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="publicar" className="text-sm text-gray-600 dark:text-gray-400">
            Publicar ahora (visible para todos)
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 rounded-md transition-colors"
          >
            {loading ? 'Guardando...' : (publicar ? 'Publicar' : 'Guardar borrador')}
          </button>
        </div>
      </form>
    </div>
  );
}
