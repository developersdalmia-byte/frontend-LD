"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

type NotificationType = "success" | "error" | "info";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
}

interface NotificationContextType {
  showNotification: (type: NotificationType, message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback((type: NotificationType, message: string, title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, message, title }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => removeNotification(id), 5000);
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {/* ── Toast Container ── */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
        {notifications.map((n) => (
          <Toast 
            key={n.id} 
            {...n} 
            onClose={() => removeNotification(n.id)} 
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

function Toast({ type, message, title, onClose }: Notification & { onClose: () => void }) {
  const icons = {
    success: <CheckCircle className="text-[#22c55e]" size={20} />,
    error: <XCircle className="text-[#ef4444]" size={20} />,
    info: <Info className="text-[#c5a059]" size={20} />,
  };

  return (
    <div className="pointer-events-auto bg-white border border-[#f0ede8] shadow-2xl p-5 min-w-[320px] max-w-[400px] animate-in slide-in-from-right-8 fade-in duration-500 rounded-sm relative group overflow-hidden">
      {/* Decorative side accent */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        type === "success" ? "bg-[#22c55e]" : type === "error" ? "bg-[#ef4444]" : "bg-[#c5a059]"
      }`} />
      
      <div className="flex gap-4">
        <div className="flex-shrink-0 mt-0.5">
          {icons[type]}
        </div>
        <div className="flex-1 pr-4">
          {title && (
            <h4 className={`${playfair.className} text-black text-sm font-bold tracking-wide mb-1`}>
              {title}
            </h4>
          )}
          <p className="text-[#6b6560] text-[11px] tracking-[0.05em] leading-relaxed uppercase">
            {message}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="text-[#ccc] hover:text-black transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      
      {/* Progress bar animation */}
      <div className="absolute bottom-0 left-1 right-0 h-[2px] bg-[#f9f8f6]">
        <div 
          className={`h-full transition-all duration-[5000ms] linear ${
            type === "success" ? "bg-[#22c55e]/30" : type === "error" ? "bg-[#ef4444]/30" : "bg-[#c5a059]/30"
          }`}
          style={{ width: "100%", animation: "progress 5s linear forwards" }}
        />
      </div>
      
      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used inside <NotificationProvider>");
  return ctx;
};
