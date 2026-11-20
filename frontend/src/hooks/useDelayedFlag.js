import { useEffect, useState } from 'react';

/** flag 가 delay(ms) 이상 계속 true 일 때만 true. 짧은 로딩의 깜빡임 방지 (표준 12장, 300ms) */
export function useDelayedFlag(flag, delay = 300) {
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (!flag) {
      setDelayed(false);
      return undefined;
    }
    const timer = setTimeout(() => setDelayed(true), delay);
    return () => clearTimeout(timer);
  }, [flag, delay]);

  return delayed;
}
