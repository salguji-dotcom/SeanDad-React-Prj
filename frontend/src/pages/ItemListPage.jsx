import { useEffect, useState } from 'react';
import { createItem, fetchItems } from '../api/itemApi.js';
import { formatDateTime } from '../utils/format.js';

export default function ItemListPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const load = () =>
    fetchItems()
      .then(setItems)
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createItem(name);
      setName('');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="container">
      <h1>품목 목록</h1>
      <p className="desc">React → Spring Boot → MyBatis → PostgreSQL 연결 확인용 샘플</p>

      <form onSubmit={handleSubmit} className="form">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="품목명"
          maxLength={100}
        />
        <button type="submit">추가</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="list">
        {items.map((item) => (
          <li key={item.itemSn}>
            <span>{item.itemNm}</span>
            <small>{formatDateTime(item.regDt)}</small>
          </li>
        ))}
        {items.length === 0 && !error && <li className="empty">품목이 없습니다.</li>}
      </ul>
    </main>
  );
}
