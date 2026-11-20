package com.seandad.app.std;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

/**
 * 공통표준 엑셀(TB_용어.xlsx, TB_단어.xlsx, TB_도메인.xlsx)을 읽습니다.
 * 첫 번째 시트의 첫 행을 헤더로 보고, 컬럼은 헤더 이름(공백 무시)으로 찾습니다.
 */
final class StdExcelReader {

    private StdExcelReader() {
    }

    static List<StdTrm> readTrms(InputStream in) throws IOException {
        return read(in, "공통표준용어명", r -> {
            StdTrm t = new StdTrm();
            t.setTrmSn(r.longValue("번호"));
            t.setEnctCyclNm(r.text("제정차수_제정연월"));
            t.setTrmNm(r.text("공통표준용어명"));
            t.setTrmExpln(r.text("공통표준용어설명"));
            t.setEngAbbrNm(r.text("공통표준용어영문약어명"));
            t.setDmnNm(r.text("공통표준도메인명"));
            t.setPrmVlCn(r.text("허용값"));
            t.setStrgFrmNm(r.text("저장형식"));
            t.setIndctFrmNm(r.text("표현형식"));
            t.setPbadmsStdCdNm(r.text("행정표준코드명"));
            t.setJrsdInstNm(r.text("소관기관명"));
            t.setSynmCn(r.text("용어이음동의어목록"));
            t.setDscdYn(discardYn(t.getEnctCyclNm()));
            return t;
        });
    }

    static List<StdWord> readWords(InputStream in) throws IOException {
        return read(in, "공통표준단어명", r -> {
            StdWord w = new StdWord();
            w.setWordSn(r.longValue("번호"));
            w.setEnctCyclNm(r.text("제정차수_제정연월"));
            w.setWordNm(r.text("공통표준단어명"));
            w.setEngAbbrNm(r.text("공통표준단어영문약어명"));
            w.setEngNm(r.text("공통표준단어영문명"));
            w.setWordExpln(r.text("공통표준단어설명"));
            w.setFrmWordYn("Y".equalsIgnoreCase(r.text("형식단어여부")) ? "Y" : "N");
            w.setDmnClsfNm(r.text("공통표준도메인분류명"));
            w.setSynmCn(r.text("이음동의어목록"));
            w.setPhwrdCn(r.text("금칙어목록"));
            w.setDscdYn(discardYn(w.getEnctCyclNm()));
            return w;
        });
    }

    static List<StdDmn> readDmns(InputStream in) throws IOException {
        return read(in, "공통표준도메인명", r -> {
            StdDmn d = new StdDmn();
            d.setDmnSn(r.longValue("번호"));
            d.setEnctCyclNm(r.text("제정차수_제정연월"));
            d.setDmnGroupNm(r.text("공통표준도메인그룹명"));
            d.setDmnClsfNm(r.text("공통표준도메인분류명"));
            d.setDmnNm(r.text("공통표준도메인명"));
            d.setDmnExpln(r.text("공통표준도메인설명"));
            d.setDataTypeNm(r.text("데이터타입"));
            d.setDataLen(r.intValue("데이터길이"));
            d.setDataDcptLen(r.intValue("데이터소수점길이"));
            d.setStrgFrmNm(r.text("저장형식"));
            d.setIndctFrmNm(r.text("표현형식"));
            d.setUnitNm(r.text("단위"));
            d.setPrmVlCn(r.text("허용값"));
            d.setDscdYn(discardYn(d.getEnctCyclNm()));
            return d;
        });
    }

    /** "6차(2023-11)\n(폐기)" → Y, "7차(2024-11)\n(폐기후 제정)" → N */
    static String discardYn(String enctCyclNm) {
        if (enctCyclNm == null) {
            return "N";
        }
        return enctCyclNm.contains("폐기") && !enctCyclNm.contains("폐기후") ? "Y" : "N";
    }

    private static <T> List<T> read(InputStream in, String requiredHeader, Function<RowValues, T> mapper)
            throws IOException {
        DataFormatter formatter = new DataFormatter();
        try (Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            Row header = sheet.getRow(sheet.getFirstRowNum());
            Map<String, Integer> columns = new HashMap<>();
            for (int i = 0; header != null && i < header.getLastCellNum(); i++) {
                String name = formatter.formatCellValue(header.getCell(i)).replaceAll("\\s", "");
                if (!name.isEmpty()) {
                    columns.putIfAbsent(name, i);
                }
            }
            if (!columns.containsKey(requiredHeader) || !columns.containsKey("번호")) {
                throw new IllegalArgumentException(
                        "엑셀 형식이 맞지 않습니다. 첫 행에 '번호', '" + requiredHeader + "' 헤더가 있어야 합니다.");
            }

            List<T> result = new ArrayList<>();
            for (int i = sheet.getFirstRowNum() + 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    continue;
                }
                RowValues values = new RowValues(row, columns, formatter);
                if (values.text("번호") == null) {
                    continue; // 빈 행
                }
                try {
                    result.add(mapper.apply(values));
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException((i + 1) + "행: 숫자 형식이 아닌 값이 있습니다. " + e.getMessage());
                }
            }
            return result;
        }
    }

    private record RowValues(Row row, Map<String, Integer> columns, DataFormatter formatter) {

        String text(String header) {
            Integer idx = columns.get(header);
            if (idx == null) {
                return null;
            }
            String v = formatter.formatCellValue(row.getCell(idx)).replace("\r", "").trim();
            return v.isEmpty() ? null : v;
        }

        Long longValue(String header) {
            String v = text(header);
            return v == null ? null : Long.valueOf(v.replace(",", ""));
        }

        Integer intValue(String header) {
            String v = text(header);
            return v == null || "-".equals(v) ? null : Integer.valueOf(v.replace(",", ""));
        }
    }
}
