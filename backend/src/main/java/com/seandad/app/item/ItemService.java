package com.seandad.app.item;

import com.seandad.app.common.NotFoundException;
import com.seandad.app.common.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ItemService {

    private static final String NOT_FOUND = "요청한 정보를 찾을 수 없습니다.";

    private final ItemMapper itemMapper;

    @Transactional(readOnly = true)
    public PageResponse<Item> search(ItemSearch search) {
        return new PageResponse<>(itemMapper.search(search), itemMapper.count(search));
    }

    @Transactional(readOnly = true)
    public Item get(Long itemSn) {
        Item item = itemMapper.findBySn(itemSn);
        if (item == null) {
            throw new NotFoundException(NOT_FOUND);
        }
        return item;
    }

    @Transactional
    public Item create(ItemSaveRequest request) {
        Item item = toItem(request);
        itemMapper.insert(item);
        return itemMapper.findBySn(item.getItemSn());
    }

    @Transactional
    public Item update(Long itemSn, ItemSaveRequest request) {
        Item item = toItem(request);
        item.setItemSn(itemSn);
        if (itemMapper.update(item) == 0) {
            throw new NotFoundException(NOT_FOUND);
        }
        return itemMapper.findBySn(itemSn);
    }

    @Transactional
    public void delete(Long itemSn) {
        if (itemMapper.delete(itemSn) == 0) {
            throw new NotFoundException(NOT_FOUND);
        }
    }

    private static Item toItem(ItemSaveRequest request) {
        Item item = new Item();
        item.setItemNm(request.itemNm().trim());
        item.setItemCn(request.itemCn() == null || request.itemCn().isBlank() ? null : request.itemCn().trim());
        item.setUseYn(request.useYn());
        return item;
    }
}
