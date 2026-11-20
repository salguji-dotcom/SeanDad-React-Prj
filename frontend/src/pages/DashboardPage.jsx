import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchItems } from '../api/itemApi.js';
import { fetchStdSummary } from '../api/stdApi.js';
import { formatDateTime } from '../utils/format.js';

const RECENT_COUNT = 5;

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [std, setStd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    fetchStdSummary()
      .then(setStd)
      .catch(() => setStd(null));
  }, []);

  // API가 품목일련번호 내림차순으로 주므로 첫 항목이 가장 최근
  const latest = items[0];
  const recent = items.slice(0, RECENT_COUNT);

  return (
    <main className="container wide">
      <h1>대시보드</h1>
      <p className="desc">등록된 데이터 현황과 바로가기</p>

      {error && <p className="error">{error}</p>}

      <section className="cards">
        <Link to="/items" className="card card-link">
          <span className="card-label">품목</span>
          <strong className="card-value">{loading ? '-' : items.length}</strong>
          <span className="card-sub">등록된 품목 수</span>
          <span className="card-go">품목 관리로 이동 →</span>
        </Link>

        <div className="card">
          <span className="card-label">최근 등록</span>
          <strong className="card-value small">{latest ? latest.itemNm : '-'}</strong>
          <span className="card-sub">{latest ? formatDateTime(latest.regDt) : '등록된 품목 없음'}</span>
        </div>

        <Link to="/std" className="card card-link">
          <span className="card-label">표준 사전</span>
          <strong className="card-value">{std ? std.trmCnt.toLocaleString() : '-'}</strong>
          <span className="card-sub">
            {std ? `용어 · 단어 ${std.wordCnt.toLocaleString()} · 도메인 ${std.dmnCnt}` : '표준 사전 조회 실패'}
          </span>
          <span className="card-go">표준 사전으로 이동 →</span>
        </Link>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>최근 품목</h2>
          <Link to="/items">전체 보기</Link>
        </div>
        <ul className="list">
          {recent.map((item) => (
            <li key={item.itemSn}>
              <span>{item.itemNm}</span>
              <small>{formatDateTime(item.regDt)}</small>
            </li>
          ))}
          {!loading && recent.length === 0 && !error && (
            <li className="empty">품목이 없습니다.</li>
          )}
        </ul>
      </section>
    </main>
  );
}
