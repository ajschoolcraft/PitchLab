import { useState, useEffect, createContext, useContext, useCallback } from 'react'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <>
      <style>{`
        .toast-container {
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
        }
        .toast {
          background: #1a1a1a;
          color: white;
          padding: 14px 20px;
          border-radius: 12px;
          font-family: 'DM Sans', -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          pointer-events: auto;
          animation: toastIn 0.3s ease;
          max-width: 380px;
          line-height: 1.4;
        }
        .toast.removing {
          animation: toastOut 0.3s ease forwards;
        }
        .toast-success {
          border-left: 4px solid #22c55e;
        }
        .toast-error {
          border-left: 4px solid #ef4444;
        }
        .toast-info {
          border-left: 4px solid #FF9500;
        }
        .toast-icon {
          font-size: 18px;
          flex-shrink: 0;
        }
        .toast-close {
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          font-size: 16px;
          cursor: pointer;
          padding: 0 0 0 8px;
          flex-shrink: 0;
          transition: color 0.2s;
        }
        .toast-close:hover {
          color: white;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(40px); }
        }
        @media (max-width: 480px) {
          .toast-container {
            left: 12px;
            right: 12px;
            top: 72px;
          }
          .toast {
            max-width: 100%;
          }
        }
      `}</style>

      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </>
  )
}

function Toast({ toast, onRemove }) {
  const [removing, setRemoving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setRemoving(true)
      setTimeout(() => onRemove(toast.id), 300)
    }, toast.duration)
    return () => clearTimeout(timer)
  }, [toast, onRemove])

  const icons = {
    success: '✓',
    error: '✕',
    info: '💡',
  }

  return (
    <div className={`toast toast-${toast.type} ${removing ? 'removing' : ''}`}>
      <span className="toast-icon">{icons[toast.type] || '✓'}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button className="toast-close" onClick={() => {
        setRemoving(true)
        setTimeout(() => onRemove(toast.id), 300)
      }}>
        ✕
      </button>
    </div>
  )
}