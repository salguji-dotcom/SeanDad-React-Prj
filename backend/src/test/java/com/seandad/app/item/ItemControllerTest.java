package com.seandad.app.item;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.seandad.app.common.NotFoundException;
import com.seandad.app.common.PageResponse;
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

    private static Item item(long sn, String nm) {
        Item item = new Item();
        item.setItemSn(sn);
        item.setItemNm(nm);
        item.setUseYn("Y");
        return item;
    }

    @Test
    void listReturnsPage() throws Exception {
        given(itemService.search(any())).willReturn(new PageResponse<>(List.of(item(1L, "첫 번째 품목")), 21));

        mockMvc.perform(get("/api/items").param("page", "2").param("size", "20").param("sort", "itemNm,asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCount").value(21))
                .andExpect(jsonPath("$.list[0].itemSn").value(1))
                .andExpect(jsonPath("$.list[0].itemNm").value("첫 번째 품목"));

        verify(itemService).search(argThat(s -> s.getOffset() == 20 && s.getOrderBy().equals("item_nm ASC")));
    }

    @Test
    void listIgnoresUnknownSortAndPageSize() throws Exception {
        given(itemService.search(any())).willReturn(new PageResponse<>(List.of(), 0));

        mockMvc.perform(get("/api/items").param("size", "7").param("sort", "item_nm;drop table,desc"))
                .andExpect(status().isOk());

        verify(itemService).search(argThat(s -> s.getLimit() == 20 && s.getOrderBy().startsWith("reg_dt DESC")));
    }

    @Test
    void getNotFound() throws Exception {
        given(itemService.get(9L)).willThrow(new NotFoundException("요청한 정보를 찾을 수 없습니다."));

        mockMvc.perform(get("/api/items/9"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("요청한 정보를 찾을 수 없습니다."));
    }

    @Test
    void createRejectsBlankNameWithFieldErrors() throws Exception {
        mockMvc.perform(post("/api/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"itemNm\":\"\",\"useYn\":\"Y\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[0].field").value("itemNm"));
    }

    @Test
    void create() throws Exception {
        given(itemService.create(any())).willReturn(item(3L, "새 품목"));

        mockMvc.perform(post("/api/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"itemNm\":\"새 품목\",\"useYn\":\"Y\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.itemSn").value(3));
    }

    @Test
    void updateRejectsInvalidUseYn() throws Exception {
        mockMvc.perform(put("/api/items/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"itemNm\":\"품목\",\"useYn\":\"X\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[0].field").value("useYn"));
    }

    @Test
    void update() throws Exception {
        given(itemService.update(eq(1L), any())).willReturn(item(1L, "바뀐 품목"));

        mockMvc.perform(put("/api/items/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"itemNm\":\"바뀐 품목\",\"useYn\":\"N\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itemNm").value("바뀐 품목"));
    }

    @Test
    void deleteItem() throws Exception {
        mockMvc.perform(delete("/api/items/1")).andExpect(status().isNoContent());
        verify(itemService).delete(1L);
    }

    @Test
    void deleteNotFound() throws Exception {
        willThrow(new NotFoundException("요청한 정보를 찾을 수 없습니다.")).given(itemService).delete(2L);
        mockMvc.perform(delete("/api/items/2")).andExpect(status().isNotFound());
    }
}
