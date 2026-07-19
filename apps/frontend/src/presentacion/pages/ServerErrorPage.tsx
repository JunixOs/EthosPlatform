import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function ServerErrorPage() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">🔧</div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Error del servidor
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-2">
        Algo salió mal en nuestros servidores. Estamos trabajando para solucionarlo.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
        Puedes intentar recargar la página{countdown > 0 ? ` en ${countdown}s` : ''}.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => window.location.reload()}
          disabled={countdown > 0}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          Recargar página
        </button>
        <Link
          to="/"
          className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
