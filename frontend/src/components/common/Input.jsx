import { useFieldRegister } from './fieldContext.js';
import styles from './Input.module.css';

/**
 * 입력칸. maxLength 는 용어사전 도메인 길이와 같게 넘깁니다.
 * width: code(160px) | name(240px) | full(행 전체),  type="number" 는 오른쪽 정렬
 * uppercase: 영문 코드·ID 대문자 자동 변환
 */
export default function Input({ name, width = 'name', type = 'text', uppercase = false, ...rest }) {
  const { form, onChange, ...field } = useFieldRegister(name);
  const className = [styles.input, styles[width], type === 'number' ? styles.number : ''].join(' ');

  const handleChange = (e) => {
    if (uppercase) e.target.value = e.target.value.toUpperCase();
    return onChange?.(e);
  };

  return (
    <input
      type={type}
      className={className}
      {...field}
      {...(form ? { onChange: handleChange } : {})}
      {...rest}
    />
  );
}
