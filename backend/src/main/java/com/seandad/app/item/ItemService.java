package com.seandad.app.item;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemMapper itemMapper;

    @Transactional(readOnly = true)
    public List<Item> findAll() {
        return itemMapper.findAll();
    }

    @Transactional
    public Item create(ItemCreateRequest request) {
        Item item = new Item();
        item.setItemNm(request.itemNm());
        itemMapper.insert(item);
        return item;
    }
}
