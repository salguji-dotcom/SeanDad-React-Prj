import client from '../client.js';

export const codeApi = {
  /** 그룹코드의 공통코드 목록 [{ cd, cdNm, sortSeq }] */
  list: (groupCd) => client.get(`/codes/${groupCd}`).then((r) => r.data),
};
