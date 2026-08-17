import { useState, useCallback } from "react";

const toastState = {
  toasts: [],
  listeners: [],
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },
  notify() {
    this.listeners.forEach(l => l([...this.toasts]));
  },
  add(toast) {
    const id = Date.now().toString();
    this.toasts.push({ ...toast, id });
    this.notify();
    setTimeout(() => this.remove(id), 4000);
  },
  remove(id) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }
};

export function useToast() {
  const [toasts, setToasts] = useState([]);

  useState(() => toastState.subscribe(setToasts));

  const toast = useCallback((props) => {
    toastState.add(props);
  }, []);

  const dismiss = useCallback((id) => {
    if (id) toastState.remove(id);
    else toastState.toasts.forEach(t => toastState.remove(t.id));
  }, []);

  return { toasts, toast, dismiss };
}
