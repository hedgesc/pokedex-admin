import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'

// Same timing and corner as the Vue app's vue-toasted setup.
const DEFAULT_DURATION = 5000

type ToastAction = {
  label: string
  onClick: () => void
}

type ToastItem = {
  id: number
  message: string
  variant: 'success' | 'danger' | 'primary'
  icon: string
  duration: number | null
  actions?: ToastAction[]
  onClose: () => void
}

type ToastApi = {
  success: (message: string) => void
  error: (message: string) => void
  /** Stays until the user picks Yes or No. Resolves false if dismissed. */
  confirm: (message: string) => Promise<boolean>
}

const ToastContext = createContext<ToastApi | null>(null)

export function useToast(): ToastApi {
  const api = useContext(ToastContext)
  if (!api) throw new Error('useToast must be used within ToastProvider')
  return api
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (toast: Omit<ToastItem, 'id' | 'onClose'> & { onClose?: () => void }) => {
      const id = ++nextId.current
      setToasts((current) => [
        ...current,
        {
          ...toast,
          id,
          onClose: () => {
            dismiss(id)
            toast.onClose?.()
          },
        },
      ])
      return id
    },
    [dismiss],
  )

  const success = useCallback(
    (message: string) => {
      push({
        message,
        variant: 'success',
        icon: 'check_circle_outline',
        duration: DEFAULT_DURATION,
      })
    },
    [push],
  )

  const error = useCallback(
    (message: string) => {
      push({
        message,
        variant: 'danger',
        icon: 'highlight_off',
        duration: DEFAULT_DURATION,
      })
    },
    [push],
  )

  const confirm = useCallback(
    (message: string) =>
      new Promise<boolean>((resolve) => {
        let settled = false
        const finish = (yes: boolean) => {
          if (settled) return
          settled = true
          resolve(yes)
        }
        push({
          message,
          variant: 'primary',
          icon: 'contact_support',
          duration: null,
          onClose: () => finish(false),
          actions: [
            { label: 'Yes', onClick: () => finish(true) },
            { label: 'No', onClick: () => finish(false) },
          ],
        })
      }),
    [push],
  )

  return (
    <ToastContext.Provider value={{ success, error, confirm }}>
      {children}
      <ToastContainer position="bottom-end" className="p-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            bg={toast.variant}
            show
            autohide={toast.duration !== null}
            delay={toast.duration ?? undefined}
            onClose={toast.onClose}
          >
            <Toast.Body className="d-flex align-items-center gap-2 text-white">
              <span className="material-icons" aria-hidden="true">
                {toast.icon}
              </span>
              <span className="me-auto">{toast.message}</span>
              {toast.actions?.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className="btn btn-sm btn-light"
                  onClick={() => {
                    action.onClick()
                    toast.onClose()
                  }}
                >
                  {action.label}
                </button>
              ))}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  )
}
