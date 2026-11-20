import client from '../client.js';

// 공통표준 사전 API (/api/std)
export const stdApi = {
  summary: () => client.get('/std/summary').then((r) => r.data),
  /** 목록 { list, totalCount }. params: keyword, includeDiscarded, page, size */
  terms: (params) => client.get('/std/terms', { params }).then((r) => r.data),
  words: (params) => client.get('/std/words', { params }).then((r) => r.data),
  domains: (params) => client.get('/std/domains', { params }).then((r) => r.data),
  suggest: (trmNm) => client.get('/std/terms/suggest', { params: { trmNm } }).then((r) => r.data),
  /** files: { trmFile, wordFile, dmnFile } (File 또는 없음) */
  importExcel: (files) => {
    const form = new FormData();
    Object.entries(files).forEach(([key, file]) => file && form.append(key, file));
    return client.post('/std/import', form).then((r) => r.data);
  },
};
