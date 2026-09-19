import { useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { Button } from "./button";

export function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head">
          <h3 id="modal-title">{title}</h3>
          <Button variant="ghost" size="icon" className="modal-x" onClick={onClose} aria-label="Close dialog">
            <X size={18} weight="bold" />
          </Button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
