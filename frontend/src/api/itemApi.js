async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `요청 실패 (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

export const fetchItems = () => request('/api/items');

export const createItem = (itemNm) =>
  request('/api/items', { method: 'POST', body: JSON.stringify({ itemNm }) });
