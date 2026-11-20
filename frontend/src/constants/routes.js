// 메뉴·라우트 정의. LNB 와 Breadcrumb 이 이 정보를 씁니다.
// TODO: 권한 API 가 생기면 메뉴 데이터를 서버에서 받아 표시합니다 (표준 2.2-②).

export const ROUTES = {
  DASHBOARD: '/',
  ITEMS: '/pr/items',
  STD_TERMS: '/sy/std-terms',
  STD_WORDS: '/sy/std-words',
  STD_DOMAINS: '/sy/std-domains',
  STD_UPLOAD: '/sy/std-uploads/new',
};

export const itemPath = (itemSn) => `${ROUTES.ITEMS}/${itemSn}`;
export const itemEditPath = (itemSn) => `${ROUTES.ITEMS}/${itemSn}/edit`;
export const ITEM_NEW_PATH = `${ROUTES.ITEMS}/new`;

/** 메뉴 최대 2단계. icon 은 LNB 접힘 상태에서 보이는 글자 */
export const MENUS = [
  { id: 'CM00', label: '대시보드', icon: '대', path: ROUTES.DASHBOARD },
  {
    id: 'PR01',
    label: '품목관리',
    icon: '품',
    children: [{ id: 'PR0101L', label: '품목', path: ROUTES.ITEMS }],
  },
  {
    id: 'SY01',
    label: '표준 사전',
    icon: '표',
    children: [
      { id: 'SY0101L', label: '표준용어', path: ROUTES.STD_TERMS },
      { id: 'SY0102L', label: '표준단어', path: ROUTES.STD_WORDS },
      { id: 'SY0103L', label: '표준도메인', path: ROUTES.STD_DOMAINS },
      { id: 'SY0104R', label: '표준 사전 업로드', path: ROUTES.STD_UPLOAD },
    ],
  },
];

const isUnder = (pathname, path) =>
  path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`);

/** 현재 경로의 메뉴 경로 (상위 메뉴 → 메뉴). Breadcrumb 에 씁니다. */
export function findMenuTrail(pathname) {
  for (const menu of MENUS) {
    if (menu.path && isUnder(pathname, menu.path)) return [menu];
    const child = menu.children?.find((c) => isUnder(pathname, c.path));
    if (child) return [menu, child];
  }
  return [];
}
