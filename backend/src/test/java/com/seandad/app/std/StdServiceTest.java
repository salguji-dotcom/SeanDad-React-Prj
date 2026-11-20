package com.seandad.app.std;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class StdServiceTest {

    @Mock
    StdMapper stdMapper;

    @InjectMocks
    StdService stdService;

    @BeforeEach
    void setUp() {
        given(stdMapper.findTrmsByNm(anyString())).willReturn(List.of());
        given(stdMapper.findActiveWords()).willReturn(List.of(
                word("등록자", "RGTR", "N", null, null, null),
                word("아이디", "ID", "Y", "명", null, null),
                word("사용자", "USER", "N", null, "사용인", "유저"),
                word("품목", "ITEM", "N", null, null, null),
                word("상태", "STTS", "N", null, null, null)));
        given(stdMapper.findDmnNmsByClsf("명")).willReturn(List.of("명V20", "명V100"));
    }

    @Test
    void standardTermIsReturnedAsIs() {
        StdTrm trm = new StdTrm();
        trm.setTrmNm("품목명");
        trm.setEngAbbrNm("ITEM_NM");
        trm.setDmnNm("명V100");
        given(stdMapper.findTrmsByNm("품목명")).willReturn(List.of(trm));

        StdTrmSuggestion s = stdService.suggest("품목명");

        assertThat(s.standard()).isTrue();
        assertThat(s.valid()).isTrue();
        assertThat(s.engAbbrNm()).isEqualTo("ITEM_NM");
        assertThat(s.dmnNm()).isEqualTo("명V100");
    }

    @Test
    void newTermIsComposedFromWords() {
        StdTrmSuggestion s = stdService.suggest("등록자아이디");

        assertThat(s.standard()).isFalse();
        assertThat(s.valid()).isTrue();
        assertThat(s.engAbbrNm()).isEqualTo("RGTR_ID");
        assertThat(s.dmnCandidates()).containsExactly("명V20", "명V100");
    }

    @Test
    void forbiddenWordIsReplaced() {
        StdTrmSuggestion s = stdService.suggest("유저아이디");

        assertThat(s.valid()).isFalse();
        assertThat(s.engAbbrNm()).isEqualTo("USER_ID");
        assertThat(s.messages()).anyMatch(m -> m.contains("금칙어") && m.contains("사용자"));
    }

    @Test
    void lastWordMustBeFormatWord() {
        StdTrmSuggestion s = stdService.suggest("품목상태");

        assertThat(s.valid()).isFalse();
        assertThat(s.engAbbrNm()).isEqualTo("ITEM_STTS");
        assertThat(s.messages()).anyMatch(m -> m.contains("형식단어"));
    }

    @Test
    void unknownWordFails() {
        StdTrmSuggestion s = stdService.suggest("아이템명");

        assertThat(s.valid()).isFalse();
        assertThat(s.engAbbrNm()).isNull();
        assertThat(s.messages()).anyMatch(m -> m.contains("신규 단어"));
    }

    @Test
    void discardFlagFromEnactmentCycle() {
        assertThat(StdExcelReader.discardYn("6차(2023-11)\n(폐기)")).isEqualTo("Y");
        assertThat(StdExcelReader.discardYn("7차(2024-11)\n(폐기후 제정)")).isEqualTo("N");
        assertThat(StdExcelReader.discardYn("2차(2020-12)")).isEqualTo("N");
    }

    private static StdWord word(String nm, String abbr, String frmYn, String clsf, String synm, String phwrd) {
        StdWord w = new StdWord();
        w.setWordNm(nm);
        w.setEngAbbrNm(abbr);
        w.setFrmWordYn(frmYn);
        w.setDmnClsfNm(clsf);
        w.setSynmCn(synm);
        w.setPhwrdCn(phwrd);
        return w;
    }
}
