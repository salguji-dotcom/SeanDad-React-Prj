package com.seandad.app.std;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 표준용어 (tb_std_trm) */
@Getter
@Setter
@NoArgsConstructor
public class StdTrm {
    /** 용어일련번호 */
    private Long trmSn;
    /** 제정차수명 */
    private String enctCyclNm;
    /** 용어명 */
    private String trmNm;
    /** 용어설명 */
    private String trmExpln;
    /** 영문약어명 */
    private String engAbbrNm;
    /** 도메인명 */
    private String dmnNm;
    /** 허용값내용 */
    private String prmVlCn;
    /** 저장형식명 */
    private String strgFrmNm;
    /** 표시형식명 */
    private String indctFrmNm;
    /** 행정표준코드명 */
    private String pbadmsStdCdNm;
    /** 소관기관명 */
    private String jrsdInstNm;
    /** 동의어내용 (용어 이음동의어 목록) */
    private String synmCn;
    /** 폐기여부 */
    private String dscdYn;
}
