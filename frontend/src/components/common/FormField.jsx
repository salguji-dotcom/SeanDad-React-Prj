import { useFormContext, useFormState } from 'react-hook-form';
import { fieldId, useFieldLayout } from './fieldContext.js';
import styles from './FormField.module.css';

function FieldLayout({ label, required, name, full, help, error, children }) {
  const layout = useFieldLayout();
  const id = fieldId(name);
  const className = [styles[layout], full ? styles.full : ''].join(' ');
  return (
    <div className={className}>
      <label className={styles.label} htmlFor={id} id={id && `${id}-label`}>
        {label}
        {required && (
          <span className={styles.required} aria-label="필수">
            *
          </span>
        )}
      </label>
      <div className={styles.control} data-invalid={Boolean(error)}>
        {children}
        {help && !error && <p className={styles.help}>{help}</p>}
        {error && (
          <p className={styles.error} id={id && `${id}-error`} role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

function BoundFormField(props) {
  const { errors } = useFormState({ name: props.name });
  const error = props.error ?? errors[props.name]?.message;
  return <FieldLayout {...props} error={error} />;
}

/**
 * 입력 항목 틀: 라벨 · 필수(*) · 오류 · 도움말을 통일합니다 (웹 화면 표준 8.1).
 * full: 한 행 전체(긴 텍스트), name: 입력칸 연결과 오류 표시에 쓰는 필드명.
 * 상세 화면의 읽기 전용 값도 FormField 안에 텍스트로 둡니다.
 */
export default function FormField(props) {
  const form = useFormContext();
  return form && props.name ? <BoundFormField {...props} /> : <FieldLayout {...props} />;
}
