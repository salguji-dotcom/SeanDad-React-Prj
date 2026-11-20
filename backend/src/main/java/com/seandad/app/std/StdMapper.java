package com.seandad.app.std;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface StdMapper {

    // ---- 조회 ----
    List<StdTrm> searchTrms(StdSearch search);

    long countTrms(StdSearch search);

    List<StdWord> searchWords(StdSearch search);

    long countWords(StdSearch search);

    List<StdDmn> searchDmns(StdSearch search);

    long countDmns(StdSearch search);

    List<StdTrm> findTrmsByNm(@Param("trmNm") String trmNm);

    List<StdWord> findActiveWords();

    List<String> findDmnNmsByClsf(@Param("dmnClsfNm") String dmnClsfNm);

    StdSummary countActive();

    // ---- 엑셀 적재 ----
    void deleteAllTrms();

    void deleteAllWords();

    void deleteAllDmns();

    void insertTrms(@Param("list") List<StdTrm> list);

    void insertWords(@Param("list") List<StdWord> list);

    void insertDmns(@Param("list") List<StdDmn> list);
}
