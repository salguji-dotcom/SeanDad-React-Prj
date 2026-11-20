import { z } from 'zod';
import { msg } from '../../../constants/messages.js';

// 표준 사전 업로드 검증: 엑셀(.xlsx)만, 파일 종류별 선택 (하나 이상)

export const UPLOAD_FIELDS = [
  { name: 'trmFile', label: '표준용어 파일', sample: 'TB_용어.xlsx' },
  { name: 'wordFile', label: '표준단어 파일', sample: 'TB_단어.xlsx' },
  { name: 'dmnFile', label: '표준도메인 파일', sample: 'TB_도메인.xlsx' },
];

export const firstFile = (fileList) => fileList?.[0] ?? null;

const excelFile = (label) =>
  z.any().refine((list) => {
    const file = firstFile(list);
    return !file || file.name.toLowerCase().endsWith('.xlsx');
  }, msg('W005', label));

export const stdUploadSchema = z.object(
  Object.fromEntries(UPLOAD_FIELDS.map((f) => [f.name, excelFile(f.label)])),
);

/** 선택한 파일이 하나도 없으면 W004 를 띄웁니다. */
export const hasAnyFile = (values) => UPLOAD_FIELDS.some((f) => firstFile(values[f.name]));
