package com.seandad.app.std;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.seandad.app.common.PageResponse;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(StdController.class)
class StdControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    StdService stdService;

    @Test
    void termsArePaged() throws Exception {
        StdTrm trm = new StdTrm();
        trm.setTrmNm("등록일시");
        trm.setEngAbbrNm("REG_DT");
        given(stdService.searchTrms(any())).willReturn(new PageResponse<>(List.of(trm), 45));

        mockMvc.perform(get("/api/std/terms").param("keyword", " 등록 ").param("page", "3").param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCount").value(45))
                .andExpect(jsonPath("$.list[0].engAbbrNm").value("REG_DT"));

        verify(stdService).searchTrms(argThat(s ->
                s.getKeyword().equals("등록") && s.getOffset() == 20 && s.getLimit() == 10 && !s.isIncludeDiscarded()));
    }
}
