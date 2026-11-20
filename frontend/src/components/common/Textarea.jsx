import { useWatch } from 'react-hook-form';
import { fmtNumber } from '../../utils/format.js';
import { useFieldRegister } from './fieldContext.js';
import styles from './Input.module.css';

function Counter({ name, maxLength }) {
  const value = useWatch({ name }) ?? '';
  return (
    <p className={styles.counter}>
      {fmtNumber(value.length)} / {fmtNumber(maxLength)}
    </p>
  );
}

/** 여러 줄 입력칸 (설명·내용). maxLength 는 용어사전 도메인 길이와 같게 넘깁니다. */
export default function Textarea({ name, rows = 5, maxLength, ...rest }) {
  const { form, ...field } = useFieldRegister(name);
  return (
    <>
      <textarea className={styles.textarea} rows={rows} maxLength={maxLength} {...field} {...rest} />
      {form && maxLength && <Counter name={name} maxLength={maxLength} />}
    </>
  );
}
