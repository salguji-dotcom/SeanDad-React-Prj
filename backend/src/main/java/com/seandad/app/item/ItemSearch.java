package com.seandad.app.item;

import com.seandad.app.common.PageQuery;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;

/** 품목 목록 조회 조건 */
@Getter
@Setter
public class ItemSearch extends PageQuery {

    private static final Map<String, String> SORT_COLUMNS = Map.of(
            "itemSn", "item_sn",
            "itemNm", "item_nm",
            "regDt", "reg_dt");

    /** 품목명 (부분일치) */
    private String itemNm;
    /** 사용여부 */
    private String useYn;

    @Override
    protected Map<String, String> sortColumns() {
        return SORT_COLUMNS;
    }

    @Override
    protected String defaultOrderBy() {
        return "reg_dt DESC, item_sn DESC";
    }
}
