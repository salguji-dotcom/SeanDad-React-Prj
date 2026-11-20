import { DEFAULT_PAGE_SIZE } from '../../../constants/codes.js';

// 표준 사전 목록(SY0101L~SY0103L) 공통 검색 조건

export const STD_SEARCH_DEFAULTS = { keyword: '', includeDiscarded: false };
export const STD_DEFAULT_PARAMS = { ...STD_SEARCH_DEFAULTS, page: 1, size: DEFAULT_PAGE_SIZE };

/** 검색어 최대 길이 (용어명·단어명 VARCHAR(300)) */
export const STD_KEYWORD_MAX = 300;

export const searchValues = (params) => ({
  keyword: params.keyword,
  includeDiscarded: params.includeDiscarded,
});
