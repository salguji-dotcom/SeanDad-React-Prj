-- 기존 DB 변경: tb_item 컬럼 추가 (품목내용, 사용여부, 삭제여부, 수정일시)
-- 공통코드 테이블은 db/init/03_com_cd.sql 을 그대로 실행합니다.
-- 실행: docker compose exec -T db psql -U app -d appdb -v ON_ERROR_STOP=1 < db/migration/20261120_02_item_columns_and_com_cd.sql
--       docker compose exec -T db psql -U app -d appdb -v ON_ERROR_STOP=1 < db/init/03_com_cd.sql

ALTER TABLE tb_item ADD COLUMN IF NOT EXISTS item_cn  VARCHAR(4000);
ALTER TABLE tb_item ADD COLUMN IF NOT EXISTS use_yn   VARCHAR(1) NOT NULL DEFAULT 'Y' CHECK (use_yn IN ('Y', 'N'));
ALTER TABLE tb_item ADD COLUMN IF NOT EXISTS del_yn   VARCHAR(1) NOT NULL DEFAULT 'N' CHECK (del_yn IN ('Y', 'N'));
ALTER TABLE tb_item ADD COLUMN IF NOT EXISTS mdfcn_dt TIMESTAMP;

COMMENT ON COLUMN tb_item.item_cn  IS '품목내용';
COMMENT ON COLUMN tb_item.use_yn   IS '사용여부';
COMMENT ON COLUMN tb_item.del_yn   IS '삭제여부';
COMMENT ON COLUMN tb_item.mdfcn_dt IS '수정일시';
