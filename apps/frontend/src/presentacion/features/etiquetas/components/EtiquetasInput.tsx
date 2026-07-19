import { useState } from 'react';

interface EtiquetasInputProps {
  etiquetas: string[];
  onChange: (etiquetas: string[]) => void;
  disabled?: boolean;
}

export function EtiquetasInput({ etiquetas, onChange, disabled }: EtiquetasInputProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const agregarEtiqueta = () => {
    const limpio = input.trim().toLowerCase();
    if (!limpio) return;
    if (etiquetas.includes(limpio)) {
      setError('Esta etiqueta ya fue agregada');
      return;
    }
    if (etiquetas.length >= 5) {
      setError('Máximo 5 etiquetas');
      return;
    }
    if (limpio.length > 50) {
      setError('Máximo 50 caracteres por etiqueta');
      return;
    }
    onChange([...etiquetas, limpio]);
    setInput('');
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      agregarEtiqueta();
    }
  };

  const eliminar = (index: number) => {
    onChange(etiquetas.filter((_, i) => i !== index));
    setError(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Etiquetas <span className="text-gray-400 font-normal">({etiquetas.length}/5)</span>
      </label>

      {error && (
        <div className="mb-2 text-xs text-red-600 dark:text-red-400">{error}</div>
      )}

      <div className="flex flex-wrap gap-2 mb-2">
        {etiquetas.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => eliminar(i)}
                className="text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-200 ml-0.5"
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>

      {etiquetas.length < 5 && !disabled && (
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null); }}
          onKeyDown={handleKeyDown}
          onBlur={agregarEtiqueta}
          placeholder="Escribe y presiona Enter..."
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      )}
    </div>
  );
}
