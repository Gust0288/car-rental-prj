import React, { createContext, useContext, useState, useCallback } from "react";

type ToastStatus = "info" | "success" | "error" | "warning";

type ToastItem = {
  id: number;
  title: string;
  description?: string;
  status?: ToastStatus;
  duration?: number;
};

type ToastContextType = {
  showToast: (t: {
    title: string;
    description?: string;
    status?: ToastStatus;
    duration?: number;
  }) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (t: {
      title: string;
      description?: string;
      status?: ToastStatus;
      duration?: number;
    }) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      const item: ToastItem = {
        id,
        title: t.title,
        description: t.description,
        status: t.status || "info",
        duration: t.duration || 6000,
      };
      setToasts((s) => [item, ...s]);
      // auto-remove
      setTimeout(() => removeToast(id), item.duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container rendered at top-right of viewport so it's independent from page re-renders */}
      <div
        style={{
          position: "fixed",
          top: 77.5,
          right: 20,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            aria-live="polite"
            style={{
              minWidth: 260,
              maxWidth: 360,
              padding: "12px 14px",
              borderRadius: 6,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              color: "#fff",
              background:
                t.status === "success"
                  ? "#38a169"
                  : t.status === "error"
                  ? "#e53e3e"
                  : t.status === "warning"
                  ? "#dd6b20"
                  : "#4a5568",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ marginRight: 12 }}>
              <div style={{ fontWeight: 600 }}>{t.title}</div>
              {t.description && (
                <div style={{ fontSize: 13, opacity: 0.9 }}>
                  {t.description}
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              aria-label="Close toast"
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.9)",
                cursor: "pointer",
                fontSize: 16,
                padding: 6,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useGlobalToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx)
    throw new Error("useGlobalToast must be used within a ToastProvider");
  return ctx;
};
