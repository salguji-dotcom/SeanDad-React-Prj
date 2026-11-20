import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import styles from './Header.module.css';

/**
 * Header 56px: 왼쪽 로고·시스템명, 오른쪽 사용자명(부서)·알림·로그아웃 (표준 2.2-①)
 * TODO: 로그인 기능이 생기면 오른쪽 사용자 영역을 채웁니다.
 */
export default function Header() {
  return (
    <header className={styles.header}>
      <Link to={ROUTES.DASHBOARD} className={styles.brand}>
        <span className={styles.logo} aria-hidden="true">
          S
        </span>
        SeanDad
      </Link>
      <div className={styles.user} />
    </header>
  );
}
