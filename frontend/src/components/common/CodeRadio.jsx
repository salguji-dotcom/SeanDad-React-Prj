import { useCode } from '../../hooks/useCode.js';
import { fieldId, useFieldRegister } from './fieldContext.js';
import { useSyncCodeValue } from './useSyncCodeValue.js';
import styles from './Choice.module.css';

/** 공통코드 라디오 그룹. 첫 항목이 FormField 라벨과 연결됩니다. */
export default function CodeRadio({ name, codeGroup, disabled = false }) {
  const { codes } = useCode(codeGroup);
  const { form, id, ...field } = useFieldRegister(name);
  useSyncCodeValue(form, name, codes);

  return (
    <div className={styles.group} role="radiogroup" aria-labelledby={`${fieldId(name)}-label`}>
      {codes.map((c, i) => (
        <label key={c.cd} className={styles.choice}>
          <input type="radio" value={c.cd} id={i === 0 ? id : undefined} disabled={disabled} {...field} />
          {c.cdNm}
        </label>
      ))}
    </div>
  );
}
