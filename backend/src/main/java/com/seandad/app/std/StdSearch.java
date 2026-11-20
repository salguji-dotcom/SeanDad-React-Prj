package com.seandad.app.std;

import com.seandad.app.common.PageQuery;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;

/**
 * 표준 사전 목록 조회 조건 (용어/단어/도메인 공통).
 * 사전 검색은 정확히 일치하는 항목을 먼저 보여 주는 관련도 순서로 고정하므로 정렬 변경을 받지 않습니다.
 */
@Getter
@Setter
public class StdSearch extends PageQuery {

    /** 검색어 */
    private String keyword = "";
    /** 폐기 항목 포함 여부 */
    private boolean includeDiscarded;

    public String getKeyword() {
        return keyword == null ? "" : keyword.trim();
    }

    @Override
    protected Map<String, String> sortColumns() {
        return Map.of();
    }

    @Override
    protected String defaultOrderBy() {
        return "";
    }
}
