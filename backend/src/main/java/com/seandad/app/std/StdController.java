package com.seandad.app.std;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/** 공통표준 사전 (용어/단어/도메인) */
@RestController
@RequestMapping("/api/std")
@RequiredArgsConstructor
public class StdController {

    private final StdService stdService;

    @GetMapping("/summary")
    public StdSummary summary() {
        return stdService.summary();
    }

    @GetMapping("/terms")
    public List<StdTrm> terms(@RequestParam(defaultValue = "") String keyword,
                              @RequestParam(defaultValue = "false") boolean includeDiscarded) {
        return stdService.searchTrms(keyword, includeDiscarded);
    }

    @GetMapping("/words")
    public List<StdWord> words(@RequestParam(defaultValue = "") String keyword,
                               @RequestParam(defaultValue = "false") boolean includeDiscarded) {
        return stdService.searchWords(keyword, includeDiscarded);
    }

    @GetMapping("/domains")
    public List<StdDmn> domains(@RequestParam(defaultValue = "") String keyword,
                                @RequestParam(defaultValue = "false") boolean includeDiscarded) {
        return stdService.searchDmns(keyword, includeDiscarded);
    }

    /** 용어 확인: 표준용어면 그대로, 없으면 표준단어 조합으로 신규 용어 제안 */
    @GetMapping("/terms/suggest")
    public StdTrmSuggestion suggest(@RequestParam String trmNm) {
        return stdService.suggest(trmNm);
    }

    /** 공통표준 엑셀 업로드. 올린 파일 종류만 전체 교체 */
    @PostMapping("/import")
    public Map<String, Integer> importExcel(@RequestPart(required = false) MultipartFile trmFile,
                                            @RequestPart(required = false) MultipartFile wordFile,
                                            @RequestPart(required = false) MultipartFile dmnFile)
            throws IOException {
        return stdService.importExcel(trmFile, wordFile, dmnFile);
    }
}
