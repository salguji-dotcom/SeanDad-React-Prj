package com.seandad.app.code;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CodeController.class)
class CodeControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    CodeService codeService;

    @Test
    void listByGroup() throws Exception {
        ComCd y = new ComCd();
        y.setGroupCd("USE_YN");
        y.setCd("Y");
        y.setCdNm("사용");
        y.setSortSeq(1);
        given(codeService.findByGroupCd("USE_YN")).willReturn(List.of(y));

        mockMvc.perform(get("/api/codes/USE_YN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].cd").value("Y"))
                .andExpect(jsonPath("$[0].cdNm").value("사용"));
    }
}
