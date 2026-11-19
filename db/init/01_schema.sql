-- PostgreSQL 컨테이너 최초 기동 시 1회 실행됩니다.
CREATE TABLE IF NOT EXISTS item (
    id         BIGSERIAL    PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO item (name) VALUES ('샘플 아이템');
