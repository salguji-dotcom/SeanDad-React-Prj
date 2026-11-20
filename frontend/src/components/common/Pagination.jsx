import { PAGE_SIZE_OPTIONS } from '../../constants/codes.js';
import styles from './Pagination.module.css';

const BLOCK = 10;

/** 페이징: 번호 10개 단위, 페이지 크기 10·20·50·100. 이동하면 맨 위로 스크롤합니다. */
export default function Pagination({ page, size, total = 0, onChange }) {
  const lastPage = Math.max(1, Math.ceil(total / size));
  const blockStart = Math.floor((page - 1) / BLOCK) * BLOCK + 1;
  const pages = Array.from({ length: Math.min(BLOCK, lastPage - blockStart + 1) }, (_, i) => blockStart + i);

  const go = (nextPage, nextSize = size) => {
    onChange(nextPage, nextSize);
    window.scrollTo({ top: 0 });
  };

  return (
    <nav className={styles.pagination} aria-label="페이지">
      <div className={styles.pages}>
        <button type="button" className={styles.page} onClick={() => go(1)} disabled={page === 1} aria-label="처음 페이지">
          «
        </button>
        <button type="button" className={styles.page} onClick={() => go(Math.max(1, blockStart - 1))} disabled={blockStart === 1} aria-label="이전 10페이지">
          ‹
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={[styles.page, p === page ? styles.current : ''].join(' ')}
            onClick={() => go(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ))}
        <button type="button" className={styles.page} onClick={() => go(Math.min(lastPage, blockStart + BLOCK))} disabled={blockStart + BLOCK > lastPage} aria-label="다음 10페이지">
          ›
        </button>
        <button type="button" className={styles.page} onClick={() => go(lastPage)} disabled={page === lastPage} aria-label="마지막 페이지">
          »
        </button>
      </div>
      <select className={styles.size} value={size} onChange={(e) => go(1, Number(e.target.value))} aria-label="페이지 크기">
        {PAGE_SIZE_OPTIONS.map((n) => (
          <option key={n} value={n}>
            {n}건씩
          </option>
        ))}
      </select>
    </nav>
  );
}
