export interface Toast {
  id: number;
  message: string;
  type: 'error' | 'warning' | 'info';
}

let toastId = 0;
let listeners: Array<(toasts: Toast[]) => void> = [];
let currentToasts: Toast[] = [];

function notify() {
  listeners.forEach((fn) => fn([...currentToasts]));
}

export function subscribe(handler: (toasts: Toast[]) => void): () => void {
  listeners.push(handler);
  return () => {
    listeners = listeners.filter((fn) => fn !== handler);
  };
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
