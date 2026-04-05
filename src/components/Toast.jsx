import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import '../styles/toast.css'

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
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
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
