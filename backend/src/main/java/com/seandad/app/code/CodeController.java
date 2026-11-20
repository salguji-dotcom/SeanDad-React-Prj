package com.seandad.app.code;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 공통코드 조회 (화면의 useCode, CodeSelect, StatusBadge 에서 사용) */
@RestController
@RequestMapping("/api/codes")
@RequiredArgsConstructor
public class CodeController {

    private final CodeService codeService;

    @GetMapping("/{groupCd}")
    public List<ComCd> list(@PathVariable String groupCd) {
        return codeService.findByGroupCd(groupCd);
    }
}
