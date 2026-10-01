'use client';

import React from 'react';
import { AlertCircle, X, CheckCircle2, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'error' | 'success' | 'info';
  title?: string;
  message: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start justify-between gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-slide-up ${
            toast.type === 'error'
              ? 'border-red-500/40 bg-red-950/80 text-red-100 ring-1 ring-red-500/30'
              : toast.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-950/80 text-emerald-100 ring-1 ring-emerald-500/30'
              : 'border-violet-500/40 bg-zinc-900/90 text-zinc-100 ring-1 ring-violet-500/30'
          }`}
        >
          <div className="flex items-start gap-3">
            {toast.type === 'error' && (
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            )}
            {toast.type === 'success' && (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            {toast.type === 'info' && (
              <Info className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
            )}

            <div>
              {toast.title && (
                <h4 className="text-xs font-bold uppercase tracking-wider mb-0.5">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs leading-relaxed">{toast.message}</p>
            </div>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-zinc-400 hover:text-white transition-colors p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
