'use client'

import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error'
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'error') => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={cn(
              'flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg text-white text-sm max-w-sm',
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            )}
          >
            {toast.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}
