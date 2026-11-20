package com.seandad.app.code;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CodeMapper {

    List<ComCd> findByGroupCd(String groupCd);
}
