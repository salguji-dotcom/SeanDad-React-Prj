import { NavLink, useLocation } from 'react-router-dom';
import { MENUS, findMenuTrail } from '../../constants/routes.js';
import { useUiStore } from '../../stores/uiStore.js';
import styles from './Lnb.module.css';

const linkClass = ({ isActive }) => [styles.link, isActive ? styles.active : ''].join(' ');

/** LNB 240px (접힘 64px, 아이콘만). 메뉴 최대 2단계, 현재 메뉴는 왼쪽 강조선 + 굵은 글씨 (표준 2.2-②) */
export default function Lnb() {
  const collapsed = useUiStore((s) => s.lnbCollapsed);
  const toggleLnb = useUiStore((s) => s.toggleLnb);
  const { pathname } = useLocation();
  const [currentGroup] = findMenuTrail(pathname);

  return (
    <nav className={[styles.lnb, collapsed ? styles.collapsed : ''].join(' ')} aria-label="메뉴">
      <ul className={styles.menus}>
        {MENUS.map((menu) => (
          <li key={menu.id}>
            {menu.path ? (
              <NavLink to={menu.path} end className={linkClass} title={collapsed ? menu.label : undefined}>
                <span className={styles.icon} aria-hidden="true">
                  {menu.icon}
                </span>
                <span className={styles.text}>{menu.label}</span>
              </NavLink>
            ) : (
              <>
                <p
                  className={[styles.group, currentGroup?.id === menu.id ? styles.groupActive : ''].join(' ')}
                  title={collapsed ? menu.label : undefined}
                >
                  <span className={styles.icon} aria-hidden="true">
                    {menu.icon}
                  </span>
                  <span className={styles.text}>{menu.label}</span>
                </p>
                <ul className={styles.children}>
                  {menu.children.map((child) => (
                    <li key={child.id}>
                      <NavLink to={child.path} className={linkClass}>
                        {child.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={styles.toggle}
        onClick={toggleLnb}
        aria-label={collapsed ? '메뉴 펼치기' : '메뉴 접기'}
        aria-expanded={!collapsed}
      >
        {collapsed ? '»' : '«'}
      </button>
    </nav>
  );
}
