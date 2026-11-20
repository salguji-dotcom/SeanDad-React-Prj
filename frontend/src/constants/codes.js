// 코드 상수 (코드값을 화면에 하드코딩하지 않고 이 상수로 비교합니다)

export const CODE_GROUP = {
  USE_YN: 'USE_YN',
  YN: 'YN',
  DSCD_YN: 'DSCD_YN',
  TRM_CHCK: 'TRM_CHCK',
};

export const YN = { Y: 'Y', N: 'N' };

/** 용어 확인 결과 (화면 판정값) */
export const TRM_CHCK = { STD: 'STD', NEW: 'NEW', INVALID: 'INVALID' };

/** 서버 공통코드가 아닌 화면 판정값. useCode 가 API 대신 이 값을 씁니다. */
export const LOCAL_CODES = {
  [CODE_GROUP.TRM_CHCK]: [
    { cd: TRM_CHCK.STD, cdNm: '표준용어' },
    { cd: TRM_CHCK.NEW, cdNm: '신규 용어' },
    { cd: TRM_CHCK.INVALID, cdNm: '확인 필요' },
  ],
};

/** StatusBadge 색상: 그룹코드 → 코드 → success | warning | danger | info | neutral */
export const STATUS_TONES = {
  [CODE_GROUP.USE_YN]: { Y: 'success', N: 'neutral' },
  [CODE_GROUP.DSCD_YN]: { N: 'success', Y: 'danger' },
  [CODE_GROUP.YN]: { Y: 'info', N: 'neutral' },
  [CODE_GROUP.TRM_CHCK]: { STD: 'info', NEW: 'success', INVALID: 'warning' },
};

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = 20;
