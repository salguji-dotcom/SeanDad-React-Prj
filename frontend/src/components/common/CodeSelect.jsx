import { useCode } from '../../hooks/useCode.js';
import { useFieldRegister } from './fieldContext.js';
import { useSyncCodeValue } from './useSyncCodeValue.js';
import styles from './Input.module.css';

/** 공통코드 선택. codeGroup 만 넘기면 옵션을 만듭니다. allOption: 검색용 "전체" */
export default function CodeSelect({ name, codeGroup, allOption = false, width = 'code', ...rest }) {
  const { codes } = useCode(codeGroup);
  const { form, ...field } = useFieldRegister(name);
  useSyncCodeValue(form, name, codes);

  return (
    <select className={[styles.select, styles[width]].join(' ')} {...field} {...rest}>
      {allOption && <option value="">전체</option>}
      {codes.map((c) => (
        <option key={c.cd} value={c.cd}>
          {c.cdNm}
        </option>
      ))}
    </select>
  );
}
