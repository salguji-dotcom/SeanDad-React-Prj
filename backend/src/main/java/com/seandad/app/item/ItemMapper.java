package com.seandad.app.item;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ItemMapper {

    List<Item> search(ItemSearch search);

    long count(ItemSearch search);

    Item findBySn(Long itemSn);

    void insert(Item item);

    int update(Item item);

    int delete(Long itemSn);
}
