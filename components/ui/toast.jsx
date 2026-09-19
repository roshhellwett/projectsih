import { useEffect, useRef, useState } from "react";
import { CheckCircle, WarningCircle, Info } from "@phosphor-icons/react";

export function ToastStack({ toasts, dismiss }) {
  return (
    <div className="toast-wrap" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <div key={t.id} className={"toast " + t.type} onClick={() => dismiss(t.id)}>
          <div className="t-ic">
            {t.type === "ok" ? (
              <CheckCircle size={16} weight="fill" />
            ) : t.type === "warn" ? (
              <WarningCircle size={16} weight="fill" />
            ) : (
              <Info size={16} weight="fill" />
            )}
          </div>
          <div>
            <b>{t.title}</b>
            {t.msg}
          </div>
        </div>
      ))}
    </div>
  );
}

export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);
  
  const push = (title, msg, type = "ok", ms = 4200) => {
    const id = ++idRef.current;
    setToasts((ts) => [...ts, { id, title, msg, type }]);
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), ms);
  };
  
  const dismiss = (id) => setToasts((ts) => ts.filter((t) => t.id !== id));
  
  return { toasts, push, dismiss };
}
