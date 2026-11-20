package com.seandad.app.common;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

/**
 * 오류 응답: { message, fieldErrors? }
 * 화면은 400 의 fieldErrors 를 해당 입력칸 아래에 표시합니다 (웹 화면 표준 8.2).
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    public record FieldError(String field, String message) {
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleValidation(MethodArgumentNotValidException e) {
        List<FieldError> fieldErrors = e.getBindingResult().getFieldErrors().stream()
                .map(err -> new FieldError(err.getField(), err.getDefaultMessage()))
                .toList();
        return Map.of("message", "입력값을 확인해 주세요.", "fieldErrors", fieldErrors);
    }

    /** 잘못된 입력값, 엑셀 형식 오류 등 */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleIllegalArgument(IllegalArgumentException e) {
        return Map.of("message", e.getMessage() == null ? "잘못된 요청입니다." : e.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleNotFound(NotFoundException e) {
        return Map.of("message", e.getMessage());
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    @ResponseStatus(HttpStatus.PAYLOAD_TOO_LARGE)
    public Map<String, String> handleMaxUploadSize(MaxUploadSizeExceededException e) {
        return Map.of("message", "업로드 파일이 너무 큽니다. (파일당 20MB 이하)");
    }
}
