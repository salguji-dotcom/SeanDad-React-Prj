package com.seandad.app.item;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** 품목 등록·수정 요청 */
public record ItemSaveRequest(
        /** 품목명 (명V100) */
        @NotBlank(message = "품목명을(를) 입력해 주세요.")
        @Size(max = 100, message = "품목명은(는) 최대 100자까지 입력할 수 있습니다.")
        String itemNm,

        /** 품목내용 (내용V4000) */
        @Size(max = 4000, message = "품목내용은(는) 최대 4000자까지 입력할 수 있습니다.")
        String itemCn,

        /** 사용여부 (여부C1) */
        @NotBlank(message = "사용여부을(를) 입력해 주세요.")
        @Pattern(regexp = "[YN]", message = "사용여부 형식이 올바르지 않습니다.")
        String useYn
) {
}
