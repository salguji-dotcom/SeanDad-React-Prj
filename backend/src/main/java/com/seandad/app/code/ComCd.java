package com.seandad.app.code;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 공통코드 (tb_com_cd) */
@Getter
@Setter
@NoArgsConstructor
public class ComCd {
    /** 그룹코드 */
    private String groupCd;
    /** 코드 */
    private String cd;
    /** 코드명 */
    private String cdNm;
    /** 정렬순서 */
    private Integer sortSeq;
}
