import { Outlet } from 'react-router-dom';
import DialogHost from '../common/DialogHost.jsx';
import Toaster from '../common/Toaster.jsx';
import Header from './Header.jsx';
import Lnb from './Lnb.jsx';
import styles from './MainLayout.module.css';

/** 공통 레이아웃: Header + LNB + 본문 (표준 2.2) */
export default function MainLayout() {
  return (
    <>
      <Header />
      <div className={styles.body}>
        <Lnb />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
      <Toaster />
      <DialogHost />
    </>
  );
}
