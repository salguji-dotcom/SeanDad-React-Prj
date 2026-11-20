import client from '../client.js';

// 품목 API (/api/items)
export const itemApi = {
  /** { list, totalCount } */
  list: (params) => client.get('/items', { params }).then((r) => r.data),
  get: (itemSn) => client.get(`/items/${itemSn}`).then((r) => r.data),
  create: (body) => client.post('/items', body).then((r) => r.data),
  update: (itemSn, body) => client.put(`/items/${itemSn}`, body).then((r) => r.data),
  remove: (itemSn) => client.delete(`/items/${itemSn}`),
};
