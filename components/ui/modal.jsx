import { useEffect, useRef } from "react";
import { X } from "@phosphor-icons/react";
import { Button } from "./button";

export function Modal({ title, onClose, children, wide }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    /*
     * Trap Tab focus inside the dialog. Without this, keyboard users Tab
     * straight through the modal into the page behind it while it looks
     * closed on screen.
     */
    const previouslyFocused = document.activeElement;
    const focusables = () =>
      panelRef.current?.querySelectorAll(
        'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
      );
    focusables()?.[0]?.focus();

    const trap = (e) => {
      if (e.key !== "Tab") return;
      const list = Array.from(focusables() || []);
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("keydown", trap);
      document.body.style.overflow = "";
      // Return focus to whatever opened the dialog.
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="modal-bg backdrop-blur-md bg-ink/40" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panelRef}
        className={`modal glass-modal ${wide ? "modal-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-head glass-nav border-b border-line">
          <h3 id="modal-title">{title}</h3>
          <Button variant="ghost" size="icon" className="modal-x spring-press" onClick={onClose} aria-label="Close dialog">
            <X size={18} weight="bold" />
          </Button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

