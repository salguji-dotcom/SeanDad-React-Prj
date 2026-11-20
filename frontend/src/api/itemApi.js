import { request } from './client.js';

export const fetchItems = () => request('/api/items');

export const createItem = (itemNm) =>
  request('/api/items', { method: 'POST', body: JSON.stringify({ itemNm }) });
