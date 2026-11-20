// 표시 형식 공통 함수 (웹 화면 표준 10장). 화면에서 직접 변환하지 않고 이 함수만 씁니다.

export const EMPTY = '-';

const isEmpty = (v) => v === null || v === undefined || v === '';
const pad = (n) => String(n).padStart(2, '0');

function toDate(value) {
  if (isEmpty(value)) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** 2026-11-20 */
export function fmtDate(value) {
  const d = toDate(value);
  return d ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : EMPTY;
}

/** 2026-11-20 14:30:05 (seconds=false 이면 14:30) */
export function fmtDateTime(value, { seconds = true } = {}) {
  const d = toDate(value);
  if (!d) return EMPTY;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}${seconds ? `:${pad(d.getSeconds())}` : ''}`;
  return `${fmtDate(d)} ${time}`;
}

/** 2026-11-01 ~ 2026-11-30 */
export function fmtPeriod(from, to) {
  return `${fmtDate(from)} ~ ${fmtDate(to)}`;
}

/** 1,234 */
export function fmtNumber(value) {
  if (isEmpty(value) || Number.isNaN(Number(value))) return EMPTY;
  return Number(value).toLocaleString('ko-KR');
}

/** 1,234,567원 (withUnit=false 이면 단위 생략: 그리드용) */
export function fmtAmount(value, { withUnit = true } = {}) {
  const n = fmtNumber(value);
  return n === EMPTY || !withUnit ? n : `${n}원`;
}

/** 12.5% */
export function fmtRate(value) {
  if (isEmpty(value) || Number.isNaN(Number(value))) return EMPTY;
  return `${Number(value).toFixed(1)}%`;
}

/** 010-1234-5678 (서버가 마스킹한 값은 그대로) */
export function fmtPhone(value) {
  if (isEmpty(value)) return EMPTY;
  const s = String(value);
  const digits = s.replace(/\D/g, '');
  if (s.includes('*') || digits.length < 9) return s;
  if (digits.startsWith('02')) return digits.replace(/^(02)(\d{3,4})(\d{4})$/, '$1-$2-$3');
  return digits.replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3');
}

/** 123-45-67890 */
export function fmtBizNo(value) {
  if (isEmpty(value)) return EMPTY;
  return String(value).replace(/^(\d{3})(\d{2})(\d{5})$/, '$1-$2-$3');
}

/** 1.2 MB */
export function fmtFileSize(bytes) {
  if (isEmpty(bytes)) return EMPTY;
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = Number(bytes);
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i += 1;
  }
  return `${i === 0 ? size : size.toFixed(1)} ${units[i]}`;
}

/** 빈 값이면 "-" */
export function fmtText(value) {
  return isEmpty(value) ? EMPTY : String(value);
}

/** DataGrid 컬럼의 format 이름 → 함수 */
export const FORMATTERS = {
  date: fmtDate,
  datetime: fmtDateTime,
  datetimeShort: (v) => fmtDateTime(v, { seconds: false }),
  number: fmtNumber,
  amount: (v) => fmtAmount(v, { withUnit: false }),
  rate: fmtRate,
  phone: fmtPhone,
  bizNo: fmtBizNo,
  text: fmtText,
};
