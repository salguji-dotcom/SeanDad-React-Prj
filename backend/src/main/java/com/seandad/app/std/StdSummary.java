package com.seandad.app.std;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 표준 사전 건수 (폐기 제외) */
@Getter
@Setter
@NoArgsConstructor
public class StdSummary {
    /** 표준용어 건수 */
    private long trmCnt;
    /** 표준단어 건수 */
    private long wordCnt;
    /** 표준도메인 건수 */
    private long dmnCnt;
}
