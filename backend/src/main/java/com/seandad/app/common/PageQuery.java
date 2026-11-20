package com.seandad.app.common;

import java.util.Map;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

/**
 * 목록 조회 공통 조건: 페이지(1부터), 페이지 크기(10·20·50·100), 정렬("필드,asc|desc").
 * 정렬 필드는 화면 필드명(camelCase)으로 받고, 하위 클래스가 허용한 컬럼으로만 바꿉니다.
 */
@Getter
@Setter
public abstract class PageQuery {

    private static final Set<Integer> PAGE_SIZES = Set.of(10, 20, 50, 100);
    private static final int DEFAULT_SIZE = 20;

    private int page = 1;
    private int size = DEFAULT_SIZE;
    private String sort;

    /** 정렬 가능한 필드명 → 컬럼명 */
    protected abstract Map<String, String> sortColumns();

    /** 정렬 조건이 없을 때 쓰는 ORDER BY 절 (컬럼 + 방향) */
    protected abstract String defaultOrderBy();

    public int getLimit() {
        return PAGE_SIZES.contains(size) ? size : DEFAULT_SIZE;
    }

    public int getOffset() {
        return (Math.max(page, 1) - 1) * getLimit();
    }

    /** MyBatis ${orderBy} 에 들어가는 값. 허용된 컬럼만 쓰므로 SQL 주입이 생기지 않습니다. */
    public String getOrderBy() {
        if (sort == null || sort.isBlank()) {
            return defaultOrderBy();
        }
        String[] parts = sort.split(",");
        String column = sortColumns().get(parts[0].trim());
        if (column == null) {
            return defaultOrderBy();
        }
        boolean desc = parts.length > 1 && "desc".equalsIgnoreCase(parts[1].trim());
        return column + (desc ? " DESC" : " ASC");
    }
}
