package com.seandad.app.item;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** 품목 등록 요청 */
public record ItemCreateRequest(
        /** 품목명 (명V100) */
        @NotBlank @Size(max = 100) String itemNm
) {
}
