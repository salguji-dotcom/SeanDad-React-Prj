import { useUiStore } from '../../stores/uiStore.js';
import styles from './Toaster.module.css';

/** 토스트 (우측 상단, 3초 후 자동 닫힘). 앱에 한 번만 둡니다. */
export default function Toaster() {
  const toasts = useUiStore((s) => s.toasts);
  const closeToast = useUiStore((s) => s.closeToast);

  return (
    <div className={styles.area} role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={[styles.toast, styles[t.type]].join(' ')}>
          <span>{t.text}</span>
          <button type="button" className={styles.close} onClick={() => closeToast(t.id)} aria-label="닫기">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
