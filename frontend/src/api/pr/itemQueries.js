import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { itemApi } from './itemApi.js';

// 품목 Query Hook. 화면은 itemApi 를 직접 부르지 않고 이 Hook 을 씁니다.

const KEY = 'items';

export function useItemList(params) {
  return useQuery({
    queryKey: [KEY, 'list', params],
    queryFn: () => itemApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useItem(itemSn) {
  return useQuery({
    queryKey: [KEY, 'detail', String(itemSn)],
    queryFn: () => itemApi.get(itemSn),
    enabled: Boolean(itemSn),
  });
}

/** 등록(itemSn 없음) / 수정 */
export function useSaveItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemSn, body }) => (itemSn ? itemApi.update(itemSn, body) : itemApi.create(body)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemSn) => itemApi.remove(itemSn),
    onSuccess: (_, itemSn) => {
      queryClient.removeQueries({ queryKey: [KEY, 'detail', String(itemSn)] });
      return queryClient.invalidateQueries({ queryKey: [KEY, 'list'] });
    },
  });
}
