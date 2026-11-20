import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { codeApi } from '../api/cm/codeApi.js';
import { LOCAL_CODES } from '../constants/codes.js';
import { EMPTY } from '../utils/format.js';

/**
 * 공통코드 조회. codes: [{ cd, cdNm }], getName(cd): 코드명 (없으면 "-")
 * 코드값(Y/N 등)은 화면에 그대로 보이지 않게 항상 getName 으로 표시합니다.
 */
export function useCode(groupCd) {
  const local = LOCAL_CODES[groupCd];
  const { data, isLoading } = useQuery({
    queryKey: ['codes', groupCd],
    queryFn: () => codeApi.list(groupCd),
    enabled: Boolean(groupCd) && !local,
    staleTime: Infinity,
  });
  const codes = useMemo(() => local ?? data ?? [], [local, data]);

  const getName = useCallback(
    (cd) => (cd === null || cd === undefined || cd === '' ? EMPTY : (codes.find((c) => c.cd === cd)?.cdNm ?? EMPTY)),
    [codes],
  );

  return { codes, getName, isLoading: !local && isLoading };
}
