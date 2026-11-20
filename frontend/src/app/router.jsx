import { Navigate, createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout.jsx';
import CM0001M from '../pages/cm/dashboard/CM0001M.jsx';
import PR0101D from '../pages/pr/item/PR0101D.jsx';
import PR0101L from '../pages/pr/item/PR0101L.jsx';
import PR0101R from '../pages/pr/item/PR0101R.jsx';
import SY0101L from '../pages/sy/std/SY0101L.jsx';
import SY0102L from '../pages/sy/std/SY0102L.jsx';
import SY0103L from '../pages/sy/std/SY0103L.jsx';
import SY0104R from '../pages/sy/std/SY0104R.jsx';

// URL 규칙 (표준 3.3): 목록 /{업무}/{리소스복수}, 상세 /:id, 등록 /new, 수정 /:id/edit
// useDirtyGuard(useBlocker) 를 쓰기 위해 데이터 라우터(createBrowserRouter)를 사용합니다.
export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <CM0001M /> },
      { path: '/pr/items', element: <PR0101L /> },
      { path: '/pr/items/new', element: <PR0101R /> },
      { path: '/pr/items/:itemSn', element: <PR0101D /> },
      { path: '/pr/items/:itemSn/edit', element: <PR0101R /> },
      { path: '/sy/std-terms', element: <SY0101L /> },
      { path: '/sy/std-words', element: <SY0102L /> },
      { path: '/sy/std-domains', element: <SY0103L /> },
      { path: '/sy/std-uploads/new', element: <SY0104R /> },
      // 이전 주소 호환
      { path: '/items', element: <Navigate to="/pr/items" replace /> },
      { path: '/std', element: <Navigate to="/sy/std-terms" replace /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
