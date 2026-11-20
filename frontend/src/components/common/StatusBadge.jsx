import { STATUS_TONES } from '../../constants/codes.js';
import { useCode } from '../../hooks/useCode.js';
import { EMPTY } from '../../utils/format.js';
import styles from './StatusBadge.module.css';

/** 상태 배지: 공통코드 → 색상 + 코드명 (코드값을 그대로 보이지 않음, 색만으로 의미 전달 금지) */
export default function StatusBadge({ group, value }) {
  const { getName } = useCode(group);
  if (value === null || value === undefined || value === '') return EMPTY;
  const tone = STATUS_TONES[group]?.[value] ?? 'neutral';
  return <span className={[styles.badge, styles[tone]].join(' ')}>{getName(value)}</span>;
}
