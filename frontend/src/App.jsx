import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import ItemListPage from './pages/ItemListPage.jsx';
import StdPage from './pages/StdPage.jsx';

export default function App() {
  return (
    <>
      <header className="topbar">
        <NavLink to="/" className="brand">
          SeanDad App
        </NavLink>
        <nav className="nav">
          <NavLink to="/" end>
            대시보드
          </NavLink>
          <NavLink to="/items">품목</NavLink>
          <NavLink to="/std">표준 사전</NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/items" element={<ItemListPage />} />
        <Route path="/std" element={<StdPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
