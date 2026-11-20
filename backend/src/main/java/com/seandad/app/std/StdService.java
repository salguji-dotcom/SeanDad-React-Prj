package com.seandad.app.std;

import com.seandad.app.std.StdTrmSuggestion.WordPiece;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class StdService {

    private static final int SEARCH_LIMIT = 100;
    /** PostgreSQL 바인드 변수 한도(32767)를 넘지 않도록 나눠서 INSERT */
    private static final int INSERT_CHUNK = 1000;

    private final StdMapper stdMapper;

    // ======================== 조회 ========================

    @Transactional(readOnly = true)
    public List<StdTrm> searchTrms(String keyword, boolean includeDiscarded) {
        return stdMapper.searchTrms(nvl(keyword), includeDiscarded, SEARCH_LIMIT);
    }

    @Transactional(readOnly = true)
    public List<StdWord> searchWords(String keyword, boolean includeDiscarded) {
        return stdMapper.searchWords(nvl(keyword), includeDiscarded, SEARCH_LIMIT);
    }

    @Transactional(readOnly = true)
    public List<StdDmn> searchDmns(String keyword, boolean includeDiscarded) {
        return stdMapper.searchDmns(nvl(keyword), includeDiscarded);
    }

    @Transactional(readOnly = true)
    public StdSummary summary() {
        return stdMapper.countActive();
    }

    // ======================== 용어 확인 / 신규 용어 제안 ========================

    /**
     * 표준용어에 있으면 그대로 돌려주고, 없으면 표준단어를 가장 적은 개수로 조합해 신규 용어를 제안합니다.
     * 이음동의어·금칙어는 표준단어로 바꾸고, 마지막 단어가 형식단어인지 확인합니다.
     */
    @Transactional(readOnly = true)
    public StdTrmSuggestion suggest(String trmNm) {
        String input = nvl(trmNm).replaceAll("\\s", "");
        if (input.isEmpty()) {
            throw new IllegalArgumentException("용어명을 입력하세요.");
        }

        List<StdTrm> exact = stdMapper.findTrmsByNm(input);
        if (!exact.isEmpty()) {
            StdTrm t = exact.get(0);
            List<String> messages = exact.size() > 1
                    ? List.of("같은 이름의 표준용어가 " + exact.size() + "건 있습니다: "
                            + exact.stream().map(e -> e.getEngAbbrNm() + "(" + e.getDmnNm() + ")")
                            .collect(Collectors.joining(", ")))
                    : List.of();
            return new StdTrmSuggestion(input, true, true, t.getEngAbbrNm(), t.getDmnNm(),
                    List.of(), List.of(), messages);
        }

        Map<String, StdWord> byName = new HashMap<>();
        Map<String, String[]> alias = new HashMap<>(); // 이음동의어/금칙어 → {표준단어명, 구분}
        for (StdWord w : stdMapper.findActiveWords()) {
            byName.putIfAbsent(w.getWordNm(), w);
        }
        for (StdWord w : byName.values()) {
            putAliases(alias, w.getSynmCn(), w.getWordNm(), "이음동의어");
            putAliases(alias, w.getPhwrdCn(), w.getWordNm(), "금칙어");
        }

        List<String> pieces = splitIntoWords(input, byName, alias);
        List<String> messages = new ArrayList<>();
        if (pieces == null) {
            messages.add("'" + input + "'을(를) 표준단어로 나눌 수 없습니다. 신규 단어 등록이 필요합니다.");
            return new StdTrmSuggestion(input, false, false, null, null, List.of(), List.of(), messages);
        }

        List<WordPiece> words = new ArrayList<>();
        for (String piece : pieces) {
            StdWord w = byName.get(piece);
            if (w == null) {
                String[] a = alias.get(piece);
                w = byName.get(a[0]);
                messages.add("'" + piece + "'은(는) " + a[1] + "입니다. 표준단어 '" + a[0] + "'을(를) 사용하세요.");
            }
            words.add(new WordPiece(piece, w.getWordNm(), w.getEngAbbrNm()));
        }
        String engAbbrNm = words.stream().map(WordPiece::engAbbrNm).collect(Collectors.joining("_"));

        StdWord last = byName.get(words.get(words.size() - 1).wordNm());
        List<String> dmnCandidates = List.of();
        if (!"Y".equals(last.getFrmWordYn())) {
            messages.add("마지막 단어 '" + last.getWordNm()
                    + "'이(가) 형식단어가 아닙니다. 용어는 형식단어(명, 번호, 일시, 여부 등)로 끝나야 합니다.");
        } else {
            dmnCandidates = stdMapper.findDmnNmsByClsf(last.getDmnClsfNm());
            if (dmnCandidates.isEmpty()) {
                messages.add("도메인분류 '" + last.getDmnClsfNm() + "'에 해당하는 도메인이 없습니다.");
            }
        }
        return new StdTrmSuggestion(input, false, messages.isEmpty(), engAbbrNm, null,
                words, dmnCandidates, messages);
    }

    /** 단어 수가 가장 적은 분해 (동적 계획법). 나눌 수 없으면 null */
    private static List<String> splitIntoWords(String input, Map<String, StdWord> byName,
                                               Map<String, String[]> alias) {
        int n = input.length();
        List<List<String>> best = new ArrayList<>(n + 1);
        for (int i = 0; i <= n; i++) {
            best.add(null);
        }
        best.set(0, List.of());
        for (int i = 0; i < n; i++) {
            if (best.get(i) == null) {
                continue;
            }
            for (int j = i + 1; j <= n; j++) {
                String piece = input.substring(i, j);
                if (byName.containsKey(piece) || alias.containsKey(piece)) {
                    List<String> cand = new ArrayList<>(best.get(i));
                    cand.add(piece);
                    if (best.get(j) == null || cand.size() < best.get(j).size()) {
                        best.set(j, cand);
                    }
                }
            }
        }
        return best.get(n);
    }

    private static void putAliases(Map<String, String[]> alias, String list, String wordNm, String kind) {
        if (list == null) {
            return;
        }
        for (String a : list.split("[,\\n]")) {
            String s = a.trim();
            if (!s.isEmpty() && !"-".equals(s)) {
                alias.putIfAbsent(s, new String[] {wordNm, kind});
            }
        }
    }

    // ======================== 엑셀 적재 ========================

    /** 올린 파일 종류만 전체 교체합니다. 하나라도 실패하면 모두 되돌립니다. */
    @Transactional
    public Map<String, Integer> importExcel(MultipartFile trmFile, MultipartFile wordFile, MultipartFile dmnFile)
            throws IOException {
        Map<String, Integer> result = new LinkedHashMap<>();
        if (isPresent(wordFile)) {
            List<StdWord> rows = read(wordFile, StdExcelReader::readWords);
            stdMapper.deleteAllWords();
            insertInChunks(rows, stdMapper::insertWords);
            result.put("wordCnt", rows.size());
        }
        if (isPresent(trmFile)) {
            List<StdTrm> rows = read(trmFile, StdExcelReader::readTrms);
            stdMapper.deleteAllTrms();
            insertInChunks(rows, stdMapper::insertTrms);
            result.put("trmCnt", rows.size());
        }
        if (isPresent(dmnFile)) {
            List<StdDmn> rows = read(dmnFile, StdExcelReader::readDmns);
            stdMapper.deleteAllDmns();
            insertInChunks(rows, stdMapper::insertDmns);
            result.put("dmnCnt", rows.size());
        }
        if (result.isEmpty()) {
            throw new IllegalArgumentException("업로드할 엑셀 파일을 하나 이상 선택하세요.");
        }
        return result;
    }

    private interface ExcelParser<T> {
        List<T> parse(InputStream in) throws IOException;
    }

    private static <T> List<T> read(MultipartFile file, ExcelParser<T> parser) throws IOException {
        try (InputStream in = file.getInputStream()) {
            return parser.parse(in);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(file.getOriginalFilename() + ": " + e.getMessage(), e);
        }
    }

    private static <T> void insertInChunks(List<T> rows, Consumer<List<T>> insert) {
        for (int i = 0; i < rows.size(); i += INSERT_CHUNK) {
            insert.accept(rows.subList(i, Math.min(i + INSERT_CHUNK, rows.size())));
        }
    }

    private static boolean isPresent(MultipartFile file) {
        return file != null && !file.isEmpty();
    }

    private static String nvl(String s) {
        return s == null ? "" : s.trim();
    }
}
