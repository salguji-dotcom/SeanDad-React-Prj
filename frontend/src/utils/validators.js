import { z } from 'zod';
import { msg } from '../constants/messages.js';

// 화면별 zod 스키마(xxxSchema.js)에서 쓰는 공통 검증 (웹 화면 표준 8.2)
// 문자열은 앞뒤 공백을 제거(trim)한 뒤 검증합니다.

/** 필수 문자열: 빈 값이면 W001, 길이 초과면 W002 */
export const requiredText = (label, max) =>
  z
    .string()
    .trim()
    .min(1, msg('W001', label))
    .max(max, msg('W002', label, max));

/** 선택 문자열: 길이 초과면 W002 */
export const optionalText = (label, max) =>
  z.string().trim().max(max, msg('W002', label, max));

/** 코드값 필수 (CodeSelect·CodeRadio) */
export const requiredCode = (label) =>
  z.string({ invalid_type_error: msg('W001', label) }).min(1, msg('W001', label));

const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^01\d{8,9}$|^0\d{1,2}\d{7,8}$/,
  bizNo: /^\d{10}$/,
};

/** 형식 검사 (전화·사업자번호는 숫자만 남겨 검사): 틀리면 W005 */
export const formatted = (label, type) =>
  z
    .string()
    .trim()
    .transform((v) => (type === 'email' ? v : v.replace(/\D/g, '')))
    .refine((v) => v === '' || PATTERNS[type].test(v), msg('W005', label));
