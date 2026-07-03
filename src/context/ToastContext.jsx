import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext();

// Standalone event bus so contexts outside the tree can fire toasts
const toastListeners = [];
export const fireToast = (message, type = 'success') => {
  toastListeners.forEach(fn => fn(message, type));
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  // Register this provider as a listener for fireToast()
  useEffect(() => {
    toastListeners.push(showToast);
    return () => {
      const idx = toastListeners.indexOf(showToast);
      if (idx > -1) toastListeners.splice(idx, 1);
    };
  }, [showToast]);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const toast = {
    success: (msg) => showToast(msg, 'success'),
    error:   (msg) => showToast(msg, 'error'),
    warning: (msg) => showToast(msg, 'warning'),
    info:    (msg) => showToast(msg, 'info'),
  };

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

  const styles = {
    success: 'border-l-4 border-emerald-500',
    error:   'border-l-4 border-rose-500',
    warning: 'border-l-4 border-amber-500',
    info:    'border-l-4 border-blue-500',
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 w-80 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl bg-white shadow-lg shadow-black/10 border border-gray-100 pointer-events-auto ${styles[t.type]}`}
            style={{ animation: 'slideIn 0.25s ease-out' }}
          >
            <span className="text-base flex-shrink-0 mt-0.5">{icons[t.type]}</span>
            <p className="text-sm font-medium flex-1 leading-snug text-gray-800">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-300 hover:text-gray-500 transition text-xs flex-shrink-0 mt-0.5"
            >✕</button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(110%); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);