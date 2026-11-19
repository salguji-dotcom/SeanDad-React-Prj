package com.seandad.app.item;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ItemMapper {

    List<Item> findAll();

    void insert(Item item);
}
