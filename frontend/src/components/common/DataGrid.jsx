import { useCode } from '../../hooks/useCode.js';
import { useDelayedFlag } from '../../hooks/useDelayedFlag.js';
import { msg } from '../../constants/messages.js';
import { FORMATTERS, fmtText } from '../../utils/format.js';
import styles from './DataGrid.module.css';

const SKELETON_ROWS = ['s1', 's2', 's3', 's4', 's5'];

function CodeText({ group, value }) {
  return useCode(group).getName(value);
}

function cellContent(col, row, rowNo) {
  if (col.field === 'rowNo') return rowNo;
  const value = row[col.field];
  if (col.render) return col.render(value, row);
  if (col.codeGroup) return <CodeText group={col.codeGroup} value={value} />;
  return (FORMATTERS[col.format] ?? fmtText)(value);
}

function SortIcon({ dir }) {
  return (
    <span className={styles.sortIcon} aria-hidden="true">
      {dir === 'asc' ? '▲' : dir === 'desc' ? '▼' : '↕'}
    </span>
  );
}

/**
 * 목록 그리드 (웹 화면 표준 9장)
 * columns: [{ field, header, width, minWidth, align, format, codeGroup, render, sortable }]
 *   field 'rowNo' = 전체 기준 순번 (page·size 로 계산), align: 문자 left · 숫자 right · 코드/날짜/상태 center
 * sort: "필드,asc|desc" (서버 정렬), onSortChange(sort)
 * emptyAction: 데이터가 하나도 없을 때 함께 보여 줄 버튼 (예: [신규])
 */
export default function DataGrid({
  columns,
  rows = [],
  rowKey,
  loading = false,
  onRowClick,
  page = 1,
  size = rows.length,
  sort,
  onSortChange,
  emptyAction,
}) {
  const showSkeleton = useDelayedFlag(loading);
  const [sortField, sortDir] = (sort ?? '').split(',');

  const handleSort = (field) => {
    const dir = sortField === field && sortDir === 'desc' ? 'asc' : 'desc';
    onSortChange?.(`${field},${dir}`);
  };

  const handleRowKeyDown = (e, row) => {
    if (e.key === 'Enter') onRowClick(row);
  };

  return (
    <div className={styles.wrap}>
      <table className={styles.grid}>
        <colgroup>
          {columns.map((col) => (
            <col key={col.field} width={col.width} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.field} scope="col" aria-sort={col.sortable && sortField === col.field ? `${sortDir}ending` : undefined}>
                {col.sortable && onSortChange ? (
                  <button type="button" className={styles.sortButton} onClick={() => handleSort(col.field)}>
                    {col.header}
                    <SortIcon dir={sortField === col.field ? sortDir : null} />
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {showSkeleton &&
            SKELETON_ROWS.map((key) => (
              <tr key={key} className={styles.skeletonRow}>
                {columns.map((col) => (
                  <td key={col.field}>
                    <span className={styles.skeleton} />
                  </td>
                ))}
              </tr>
            ))}
          {!showSkeleton &&
            rows.map((row, i) => (
              <tr
                key={row[rowKey]}
                className={onRowClick ? styles.clickable : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={onRowClick ? (e) => handleRowKeyDown(e, row) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
              >
                {columns.map((col) => {
                  const content = cellContent(col, row, (page - 1) * size + i + 1);
                  return (
                    <td
                      key={col.field}
                      className={[styles[col.align ?? 'left'], col.minWidth ? styles.wide : ''].join(' ')}
                      title={typeof content === 'string' ? content : undefined}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                <span className={styles.emptyIcon} aria-hidden="true">
                  ⌕
                </span>
                <p>{msg('I003')}</p>
                {emptyAction && <div className={styles.emptyAction}>{emptyAction}</div>}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
