import { useFieldRegister } from './fieldContext.js';
import styles from './Choice.module.css';

/** 단일 체크박스 (예: 폐기 포함). 그룹은 공통코드 연계 컴포넌트를 씁니다. */
export default function Checkbox({ name, label, ...rest }) {
  const { form, ...field } = useFieldRegister(name);
  return (
    <label className={styles.choice}>
      <input type="checkbox" {...field} {...rest} />
      {label}
    </label>
  );
}
