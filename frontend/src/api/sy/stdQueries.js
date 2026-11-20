import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stdApi } from './stdApi.js';

// 표준 사전 Query Hook

const KEY = 'std';

export function useStdSummary() {
  return useQuery({ queryKey: [KEY, 'summary'], queryFn: stdApi.summary });
}

const listHook = (type, fn) => (params) =>
  useQuery({
    queryKey: [KEY, type, params],
    queryFn: () => fn(params),
    placeholderData: keepPreviousData,
  });

export const useStdTermList = listHook('terms', stdApi.terms);
export const useStdWordList = listHook('words', stdApi.words);
export const useStdDomainList = listHook('domains', stdApi.domains);

/** 용어 확인 (표준용어 여부, 없으면 표준단어 조합 제안) */
export function useTermSuggest(trmNm) {
  return useQuery({
    queryKey: [KEY, 'suggest', trmNm],
    queryFn: () => stdApi.suggest(trmNm),
    enabled: Boolean(trmNm),
  });
}

export function useStdImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stdApi.importExcel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}
