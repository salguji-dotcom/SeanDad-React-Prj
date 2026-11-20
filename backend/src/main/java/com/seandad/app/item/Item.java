package com.seandad.app.item;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 품목 (tb_item) */
@Getter
@Setter
@NoArgsConstructor
public class Item {
    /** 품목일련번호 */
    private Long itemSn;
    /** 품목명 */
    private String itemNm;
    /** 등록일시 */
    private LocalDateTime regDt;
}
