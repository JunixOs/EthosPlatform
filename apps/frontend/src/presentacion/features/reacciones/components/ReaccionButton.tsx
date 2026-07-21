import { useState } from 'react';
import { reaccionesService } from '@features/reacciones/services/reacciones.service';

interface ReaccionButtonProps {
  experienciaId: string;
  initialCount?: number;
  initialHasReacted?: boolean;
}

export function ReaccionButton({ experienciaId, initialCount = 0, initialHasReacted = false }: ReaccionButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [hasReacted, setHasReacted] = useState(initialHasReacted);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const result = await reaccionesService.toggle(experienciaId);
      setCount(result.totalReacciones);
      setHasReacted(result.accion === 'agregado');
    } catch {
      // Silencioso — no queremos interrumpir la UX
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        hasReacted
          ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      } disabled:opacity-50`}
      title={hasReacted ? 'Quitar me gusta' : 'Me gusta'}
    >
      <span className="text-base">{hasReacted ? '❤️' : '🤍'}</span>
      <span>{count}</span>
    </button>
  );
}
