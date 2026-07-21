import { useState, useEffect, useCallback } from 'react';
import { experienciasService } from '@features/experiencias/services/experiencias.service';
import type { Experiencia } from '@features/experiencias/types/experiencia.types';

export function useExperiencias(page = 1) {
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await experienciasService.listar({ page });
      setExperiencias(res.data);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar experiencias');
    } finally {
      setLoading(false);
    }
  }, [page]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount/page-change, intentional
  useEffect(() => { void fetch(); }, [fetch]);

  return { experiencias, total, loading, error, refetch: fetch };
}

export function useExperiencia(id: string) {
  const [experiencia, setExperiencia] = useState<Experiencia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount, intentional
    setLoading(true);
    experienciasService.getById(id)
      .then(setExperiencia)
      .catch((e) => setError(e instanceof Error ? e.message : 'Error'))
      .finally(() => setLoading(false));
  }, [id]);

  return { experiencia, loading, error };
}
