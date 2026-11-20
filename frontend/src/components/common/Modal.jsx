import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * 팝업 (웹 화면 표준 4.4). size: s 480 · m 720 · l 960
 * 헤더(제목·X) / 본문 / 푸터(버튼) 3단. ESC·X 로 닫고, 딤 클릭으로는 닫지 않습니다. 포커스를 팝업 안에 가둡니다.
 */
export default function Modal({ open, size = 'm', title, footer, onClose, children }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  // 부모가 매번 새 함수를 넘겨도 포커스 처리가 다시 돌지 않도록 ref 로 둡니다.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const dialog = dialogRef.current;
    const focusables = () => [...dialog.querySelectorAll(FOCUSABLE)].filter((el) => !el.disabled);
    const first = focusables().find((el) => el.dataset.autofocus) ?? focusables()[0];
    first?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current?.();
      } else if (e.key === 'Tab') {
        const list = focusables();
        if (!list.length) return;
        const [head, tail] = [list[0], list[list.length - 1]];
        if (e.shiftKey && document.activeElement === head) {
          e.preventDefault();
          tail.focus();
        } else if (!e.shiftKey && document.activeElement === tail) {
          e.preventDefault();
          head.focus();
        }
      }
    };
    dialog.addEventListener('keydown', handleKeyDown);
    return () => {
      dialog.removeEventListener('keydown', handleKeyDown);
      previous?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className={styles.dim}>
      <div ref={dialogRef} className={[styles.modal, styles[size]].join(' ')} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className={styles.head}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="닫기">
            ×
          </button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
