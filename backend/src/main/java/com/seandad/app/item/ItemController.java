package com.seandad.app.item;

import com.seandad.app.common.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    /** 목록: ?itemNm=&useYn=&page=1&size=20&sort=regDt,desc */
    @GetMapping
    public PageResponse<Item> list(ItemSearch search) {
        return itemService.search(search);
    }

    @GetMapping("/{itemSn}")
    public Item get(@PathVariable Long itemSn) {
        return itemService.get(itemSn);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Item create(@Valid @RequestBody ItemSaveRequest request) {
        return itemService.create(request);
    }

    @PutMapping("/{itemSn}")
    public Item update(@PathVariable Long itemSn, @Valid @RequestBody ItemSaveRequest request) {
        return itemService.update(itemSn, request);
    }

    @DeleteMapping("/{itemSn}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long itemSn) {
        itemService.delete(itemSn);
    }
}
