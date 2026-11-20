package com.seandad.app.std;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 표준도메인 (tb_std_dmn) */
@Getter
@Setter
@NoArgsConstructor
public class StdDmn {
    /** 도메인일련번호 */
    private Long dmnSn;
    /** 제정차수명 */
    private String enctCyclNm;
    /** 도메인그룹명 */
    private String dmnGroupNm;
    /** 도메인분류명 */
    private String dmnClsfNm;
    /** 도메인명 */
    private String dmnNm;
    /** 도메인설명 */
    private String dmnExpln;
    /** 자료유형명 */
    private String dataTypeNm;
    /** 자료길이 */
    private Integer dataLen;
    /** 자료소수점길이 */
    private Integer dataDcptLen;
    /** 저장형식명 */
    private String strgFrmNm;
    /** 표시형식명 */
    private String indctFrmNm;
    /** 단위명 */
    private String unitNm;
    /** 허용값내용 */
    private String prmVlCn;
    /** 폐기여부 */
    private String dscdYn;
}
