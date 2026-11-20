package com.seandad.app.common;

/** 요청한 데이터가 없을 때 (404) */
public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }
}
