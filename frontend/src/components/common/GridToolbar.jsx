import { fmtNumber } from '../../utils/format.js';
import styles from './GridToolbar.module.css';

/** 그리드 상단 바: 왼쪽 "총 N건", 오른쪽 버튼 ([엑셀 다운로드][삭제][신규] 순서) */
export default function GridToolbar({ total, children }) {
  return (
    <div className={styles.toolbar}>
      <p className={styles.total}>
        총 <strong>{fmtNumber(total ?? 0)}</strong>건
      </p>
      <div className={styles.buttons}>{children}</div>
    </div>
  );
}
