import { useFieldRegister } from './fieldContext.js';
import styles from './Input.module.css';

/** 파일 선택 (공통 컴포넌트 추가 제안: 표준 6장 목록에 없음). 값은 FileList 입니다. */
export default function FileInput({ name, accept, ...rest }) {
  const { form, ...field } = useFieldRegister(name);
  return <input type="file" className={[styles.input, styles.full].join(' ')} accept={accept} {...field} {...rest} />;
}
