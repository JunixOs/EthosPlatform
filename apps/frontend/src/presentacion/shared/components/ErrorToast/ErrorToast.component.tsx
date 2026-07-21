import { useEffect, useState } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'error' | 'warning' | 'info';
}

let toastId = 0;
const listeners: Array<(toasts: Toast[]) => void> = [];
let currentToasts: Toast[] = [];

function notify() {
  listeners.forEach((fn) => fn([...currentToasts]));
}

export function showToast(message: string, type: Toast['type'] = 'error') {
  const id = ++toastId;
  currentToasts = [...currentToasts, { id, message, type }];
  notify();
  setTimeout(() => {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    notify();
  }, 5000);
}

export function ErrorToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (newToasts: Toast[]) => setToasts(newToasts);
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg px-4 py-3 shadow-lg text-sm font-medium border animate-in fade-in slide-in-from-right-4 ${
            toast.type === 'error'
              ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300'
              : toast.type === 'warning'
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
