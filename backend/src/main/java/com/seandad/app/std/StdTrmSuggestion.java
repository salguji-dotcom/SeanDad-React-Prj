package com.seandad.app.std;

import java.util.List;

/**
 * 용어 확인 결과.
 *
 * @param trmNm         입력한 용어명
 * @param standard      표준용어 사전에 있으면 true
 * @param valid         바로 사용할 수 있으면 true (표준용어이거나, 문제없는 신규 조합)
 * @param engAbbrNm     영문약어명 (표준 또는 조합 결과, 분해 실패 시 null)
 * @param dmnNm         표준용어의 도메인명 (신규 조합이면 null)
 * @param words         분해된 단어 목록
 * @param dmnCandidates 신규 조합일 때 도메인 후보
 * @param messages      경고/안내 메시지
 */
public record StdTrmSuggestion(
        String trmNm,
        boolean standard,
        boolean valid,
        String engAbbrNm,
        String dmnNm,
        List<WordPiece> words,
        List<String> dmnCandidates,
        List<String> messages
) {

    /**
     * @param inputNm   입력에서 잘라낸 부분
     * @param wordNm    표준단어명 (이음동의어·금칙어이면 대체 표준단어)
     * @param engAbbrNm 표준단어 영문약어명
     */
    public record WordPiece(String inputNm, String wordNm, String engAbbrNm) {
    }
}
