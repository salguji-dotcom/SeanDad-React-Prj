import { useCallback, useEffect, useRef } from 'react';
import { useBlocker } from 'react-router-dom';
import { useConfirm } from './useMessage.js';

/**
 * 변경 사항 이탈 확인 (W003). 메뉴 이동·뒤로가기는 확인 대화상자, 새로고침·창 닫기는 브라우저 확인.
 * 저장 성공 후 이동할 때는 반환값 allowLeave() 를 먼저 부릅니다.
 */
export function useDirtyGuard(when) {
  const confirm = useConfirm();
  const bypass = useRef(false);
  const asking = useRef(false);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      when && !bypass.current && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state !== 'blocked' || asking.current) return;
    asking.current = true;
    confirm('W003').then((ok) => {
      asking.current = false;
      if (ok) blocker.proceed();
      else blocker.reset();
    });
  }, [blocker, confirm]);

  useEffect(() => {
    if (!when) return undefined;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [when]);

  return useCallback(() => {
    bypass.current = true;
  }, []);
}
