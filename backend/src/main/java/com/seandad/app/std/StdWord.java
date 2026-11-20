package com.seandad.app.std;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 표준단어 (tb_std_word) */
@Getter
@Setter
@NoArgsConstructor
public class StdWord {
    /** 단어일련번호 */
    private Long wordSn;
    /** 제정차수명 */
    private String enctCyclNm;
    /** 단어명 */
    private String wordNm;
    /** 영문약어명 */
    private String engAbbrNm;
    /** 영문명 */
    private String engNm;
    /** 단어설명 */
    private String wordExpln;
    /** 형식단어여부 */
    private String frmWordYn;
    /** 도메인분류명 */
    private String dmnClsfNm;
    /** 동의어내용 (이음동의어 목록) */
    private String synmCn;
    /** 금칙어내용 */
    private String phwrdCn;
    /** 폐기여부 */
    private String dscdYn;
}
