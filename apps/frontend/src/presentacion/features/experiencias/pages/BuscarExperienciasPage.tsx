import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { experienciasService } from '@features/experiencias/services/experiencias.service';
import { etiquetasService } from '@features/etiquetas/services/etiquetas.service';
import type { Experiencia } from '@features/experiencias/types/experiencia.types';

import { LinkComponent } from '@/shared/components/Link/Link.component';
import { CardComponent } from '@/shared/components/Card/Card.component';

export function BuscarExperienciasPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [results, setResults] = useState<Experiencia[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchText = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await experienciasService.buscar(q.trim(), 1, 20);
      setResults(res.data);
      setTotal(res.total);
      setSearchParams({ q: q.trim() });
    } catch {
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [setSearchParams]);

  const searchEtiqueta = useCallback(async (slug: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await etiquetasService.buscarPorEtiqueta(slug, 1, 20);
      setResults(res.data);
      setTotal(res.total);
    } catch {
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    const etiqueta = searchParams.get('etiqueta');
    if (etiqueta) {
      setQuery(`#${etiqueta}`);
      void searchEtiqueta(etiqueta);
    } else if (q) {
      setQuery(q);
      void searchText(q);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void searchText(query);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Buscar experiencias</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título o descripción..."
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
        >
          {loading ? '...' : 'Buscar'}
        </button>
      </form>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent" />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {searchParams.get('etiqueta')
              ? `No se encontraron experiencias para la etiqueta "${searchParams.get('etiqueta')}".`
              : `No se encontraron experiencias para "{query}".`}
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {total} resultado{total !== 1 ? 's' : ''}{' '}
            {searchParams.get('etiqueta')
              ? `para la etiqueta "#${searchParams.get('etiqueta')}"`
              : `para "{searchParams.get('q')}"`}
          </p>
          <div className="space-y-4">
            {results.map((exp) => (
              <CardComponent>
                <LinkComponent
                  key={exp.id}
                  to={`/experiencias/${exp.id}`}
                  variant='card_type'
                  size='none'
                  className="block rounded-xl shadow p-5 transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{exp.titulo}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{exp.descripcion}</p>
                  <p className="text-xs text-gray-400">{new Date(exp.creadaEn).toLocaleDateString('es-ES')}</p>
                </LinkComponent>
              </CardComponent>
              
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
