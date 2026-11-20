import { z } from 'zod';
import { optionalText, requiredCode, requiredText } from '../../../utils/validators.js';

// 품목 등록·수정 검증 (길이는 용어사전 도메인: 품목명 명V100, 품목내용 내용V4000)
export const ITEM_MAX = { itemNm: 100, itemCn: 4000 };

export const itemSchema = z.object({
  itemNm: requiredText('품목명', ITEM_MAX.itemNm),
  useYn: requiredCode('사용여부'),
  itemCn: optionalText('품목내용', ITEM_MAX.itemCn),
});

export const ITEM_DEFAULTS = { itemNm: '', useYn: 'Y', itemCn: '' };
