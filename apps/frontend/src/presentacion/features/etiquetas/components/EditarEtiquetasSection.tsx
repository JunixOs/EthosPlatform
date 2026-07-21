import { useState } from 'react';
import { EtiquetasInput } from '@features/etiquetas/components/EtiquetasInput';
import { etiquetasService } from '@features/etiquetas/services/etiquetas.service';

interface EditarEtiquetasSectionProps {
  experienciaId: string;
  etiquetasIniciales: string[];
  onUpdate?: (etiquetas: string[]) => void;
}

export function EditarEtiquetasSection({ experienciaId, etiquetasIniciales, onUpdate }: Readonly<EditarEtiquetasSectionProps>) {
  const [etiquetas, setEtiquetas] = useState(etiquetasIniciales);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGuardar = async () => {
    setGuardando(true);
    setError(null);
    try {
      const res = await etiquetasService.asociar(experienciaId, etiquetas);
      onUpdate?.(res.etiquetas.map((e) => e.nombre));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar etiquetas');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Etiquetas</h3>
      {error && (
        <div className="mb-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm rounded-md px-3 py-2">
          {error}
        </div>
      )}
      <EtiquetasInput etiquetas={etiquetas} onChange={setEtiquetas} />
      <div className="flex justify-end mt-3">
        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
        >
          {guardando ? 'Guardando...' : 'Guardar etiquetas'}
        </button>
      </div>
    </div>
  );
}
