import { useRef, useState } from "react";
import { CheckCircle, WarningCircle, Info, X } from "@phosphor-icons/react";

/*
 * Toast notifications.
 *
 * aria-live="polite" on the container is what makes these announcements reach
 * screen readers at all — for this portal the toast IS the primary
 * confirmation ("Grievance Registered"), so without it the entire submit flow
 * is silent to non-visual users.
 *
 * Dismissal is a real <button> (keyboard reachable), not a click handler on a
 * div. The decorative status icon is hidden from assistive tech because the
 * toast type is conveyed by the accessible name.
 */
export function ToastStack({ toasts, dismiss }) {
  return (
    <div className="toast-wrap" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={"toast " + t.type} role="status">
          <div className="t-ic" aria-hidden="true">
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
          <button
            type="button"
            className="toast-x"
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss notification"
          >
            <X size={13} weight="bold" />
          </button>
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

