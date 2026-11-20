import { request, toQuery } from './client.js';

export const fetchStdSummary = () => request('/api/std/summary');

export const searchStdTerms = (keyword, includeDiscarded) =>
  request(`/api/std/terms?${toQuery({ keyword, includeDiscarded })}`);

export const searchStdWords = (keyword, includeDiscarded) =>
  request(`/api/std/words?${toQuery({ keyword, includeDiscarded })}`);

export const searchStdDomains = (keyword, includeDiscarded) =>
  request(`/api/std/domains?${toQuery({ keyword, includeDiscarded })}`);

export const suggestStdTerm = (trmNm) => request(`/api/std/terms/suggest?${toQuery({ trmNm })}`);

/** files: { trmFile, wordFile, dmnFile } 중 선택한 것만 */
export const importStdExcel = (files) => {
  const form = new FormData();
  Object.entries(files).forEach(([key, file]) => file && form.append(key, file));
  return request('/api/std/import', { method: 'POST', body: form });
};
