package com.seandad.app.item;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ItemController.class)
class ItemControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    ItemService itemService;

    @Test
    void list() throws Exception {
        Item item = new Item();
        item.setItemSn(1L);
        item.setItemNm("첫 번째 품목");
        given(itemService.findAll()).willReturn(List.of(item));

        mockMvc.perform(get("/api/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].itemSn").value(1))
                .andExpect(jsonPath("$[0].itemNm").value("첫 번째 품목"));
    }

    @Test
    void createRejectsBlankName() throws Exception {
        mockMvc.perform(post("/api/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"itemNm\":\"\"}"))
                .andExpect(status().isBadRequest());
    }
}
