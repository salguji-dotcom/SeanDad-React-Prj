package com.seandad.app.common;

import java.util.List;

/** 서버 페이징 목록 응답 */
public record PageResponse<T>(List<T> list, long totalCount) {
}
