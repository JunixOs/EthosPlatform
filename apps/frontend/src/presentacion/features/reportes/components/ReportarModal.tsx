import { useState, type SubmitEvent } from 'react';
import { reportesService } from '@features/reportes/services/reportes.service';

interface ReportarModalProps {
  experienciaId: string;
  isOpen: boolean;
  onClose: () => void;
}

const TIPOS = [
  { value: 'spam', label: 'Spam' },
  { value: 'contenido_inapropiado', label: 'Contenido inapropiado' },
  { value: 'acoso', label: 'Acoso' },
  { value: 'informacion_falsa', label: 'Información falsa' },
  { value: 'otro', label: 'Otro' },
] as const;

export function ReportarModal({ experienciaId, isOpen, onClose }: Readonly<ReportarModalProps>) {
  const [tipo, setTipo] = useState<(typeof TIPOS)[number]['value']>('spam');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await reportesService.crear({ experienciaId, tipo, descripcion: descripcion || undefined });
      setExito(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al reportar');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTipo('spam');
    setDescripcion('');
    setExito(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
        {exito ? (
          <div className="text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-lg font-semibold mb-2">Reporte enviado</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Gracias por ayudarnos a mantener la comunidad segura. Revisaremos tu reporte pronto.
            </p>
            <button
              onClick={handleClose}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reportar contenido</h3>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl">&times;</button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm rounded-md px-4 py-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium mb-1">Motivo</label>
                <select
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as (typeof TIPOS)[number]['value'])}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  {TIPOS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="descripcionReporte" className="block text-sm font-medium mb-1">Descripción (opcional)</label>
                <textarea
                  id="descripcionReporte"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                  placeholder="Cuéntanos más detalles..."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2 rounded-md text-sm transition-colors"
                >
                  {loading ? 'Enviando...' : 'Reportar'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
