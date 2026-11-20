import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * 목록 검색 조건·페이지·정렬을 URL 쿼리스트링에 저장 (웹 화면 표준 2.3, 13.2).
 * defaults 의 값 종류(숫자·불린·문자)대로 읽고, 기본값과 같은 항목은 URL 에서 뺍니다.
 */
export function useSearchParamsState(defaults) {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(() => {
    const result = {};
    Object.entries(defaults).forEach(([key, def]) => {
      const raw = searchParams.get(key);
      if (raw === null) result[key] = def;
      else if (typeof def === 'number') result[key] = Number(raw) > 0 ? Number(raw) : def;
      else if (typeof def === 'boolean') result[key] = raw === 'true';
      else result[key] = raw;
    });
    return result;
    // defaults 는 화면 파일 상단 상수이므로 바뀌지 않습니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const setParams = useCallback(
    (next) => {
      const query = {};
      Object.entries(defaults).forEach(([key, def]) => {
        const value = next[key] ?? def;
        if (value !== def && value !== '') query[key] = String(value);
      });
      setSearchParams(query);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setSearchParams],
  );

  return [params, setParams];
}
