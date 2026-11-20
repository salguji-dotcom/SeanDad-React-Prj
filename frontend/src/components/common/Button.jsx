import styles from './Button.module.css';

/**
 * 버튼 (웹 화면 표준 7장)
 * variant: primary(영역에 1개) | secondary | danger(실행 전 확인) | text,  size: s | m | l
 * loading: 처리 중 스피너 + 비활성 (중복 요청 방지). 아이콘만 있으면 aria-label 필수.
 */
export default function Button({
  variant = 'secondary',
  size = 'm',
  type = 'button',
  loading = false,
  disabled = false,
  icon = null,
  children,
  ...rest
}) {
  const className = [styles.button, styles[variant], styles[size]].join(' ');
  return (
    <button type={type} className={className} disabled={disabled || loading} aria-busy={loading} {...rest}>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}
