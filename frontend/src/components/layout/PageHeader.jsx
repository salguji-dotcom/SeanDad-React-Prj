import { useLocation } from 'react-router-dom';
import { findMenuTrail } from '../../constants/routes.js';
import styles from './PageHeader.module.css';

/**
 * 페이지 헤더: 제목(22px Bold) + 화면 ID(회색 작은 글씨), 오른쪽 Breadcrumb (표준 2.2-③)
 * Breadcrumb 은 메뉴 정보로 자동 생성하고, 제목이 메뉴명과 다르면(상세·등록) 끝에 붙입니다.
 */
export default function PageHeader({ title, screenId }) {
  const { pathname } = useLocation();
  const trail = findMenuTrail(pathname).map((m) => m.label);
  if (trail[trail.length - 1] !== title) trail.push(title);

  return (
    <div className={styles.header}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{title}</h1>
        <span className={styles.screenId}>{screenId}</span>
      </div>
      <ol className={styles.breadcrumb} aria-label="현재 위치">
        <li>홈</li>
        {trail.map((label) => (
          <li key={label} aria-current={label === title ? 'page' : undefined}>
            {label}
          </li>
        ))}
      </ol>
    </div>
  );
}
