-- PostgreSQL 컨테이너 최초 기동 시 1회 실행됩니다.
-- 이름은 공통표준(docs/standards)을 따릅니다. CLAUDE.md 참고.

-- 품목
CREATE TABLE IF NOT EXISTS tb_item (
    item_sn BIGINT       GENERATED ALWAYS AS IDENTITY,
    item_nm VARCHAR(100) NOT NULL,
    reg_dt  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tb_item_pk PRIMARY KEY (item_sn)
);

COMMENT ON TABLE  tb_item         IS '품목';
COMMENT ON COLUMN tb_item.item_sn IS '품목일련번호';
COMMENT ON COLUMN tb_item.item_nm IS '품목명';
COMMENT ON COLUMN tb_item.reg_dt  IS '등록일시';

INSERT INTO tb_item (item_nm) VALUES ('샘플 품목');
