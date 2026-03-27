import { useState, useEffect } from "react"

export type ToastProps = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive" | "epic"
}

let count = 0
const genId = () => {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type Action =
  | { type: "ADD_TOAST"; toast: ToastProps }
  | { type: "DISMISS_TOAST"; toastId: string }
  | { type: "REMOVE_TOAST"; toastId: string }

let memoryState: { toasts: ToastProps[] } = { toasts: [] }
let listeners: Array<(state: { toasts: ToastProps[] }) => void> = []

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

function reducer(state: { toasts: ToastProps[] }, action: Action) {
  switch (action.type) {
    case "ADD_TOAST":
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, 3) }
    case "DISMISS_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) }
    case "REMOVE_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) }
  }
}

export function toast(props: Omit<ToastProps, "id">) {
  const id = genId()
  const newToast = { ...props, id }
  dispatch({ type: "ADD_TOAST", toast: newToast })
  
  setTimeout(() => {
    dispatch({ type: "DISMISS_TOAST", toastId: id })
  }, props.variant === "epic" ? 5000 : 3000)

  return id
}

export function useToast() {
  const [state, setState] = useState(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      listeners = listeners.filter((l) => l !== setState)
    }
  }, [])

  return { toasts: state.toasts, toast, dismiss: (toastId: string) => dispatch({ type: "DISMISS_TOAST", toastId }) }
}
