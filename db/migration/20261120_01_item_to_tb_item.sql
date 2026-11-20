-- 기존 DB(item 테이블)를 공통표준 이름(tb_item)으로 바꾸는 변경 SQL. 데이터는 그대로 유지됩니다.
-- 새로 만드는 DB는 db/init/01_schema.sql 로 생성되므로 이 파일을 실행할 필요가 없습니다.
-- 실행: docker compose exec -T db psql -U app -d appdb -v ON_ERROR_STOP=1 < db/migration/20261120_01_item_to_tb_item.sql

BEGIN;

ALTER TABLE item RENAME TO tb_item;
ALTER TABLE tb_item RENAME COLUMN id         TO item_sn;
ALTER TABLE tb_item RENAME COLUMN name       TO item_nm;
ALTER TABLE tb_item RENAME COLUMN created_at TO reg_dt;

ALTER TABLE tb_item RENAME CONSTRAINT item_pkey TO tb_item_pk;
ALTER SEQUENCE item_id_seq RENAME TO tb_item_item_sn_seq;

COMMENT ON TABLE  tb_item         IS '품목';
COMMENT ON COLUMN tb_item.item_sn IS '품목일련번호';
COMMENT ON COLUMN tb_item.item_nm IS '품목명';
COMMENT ON COLUMN tb_item.reg_dt  IS '등록일시';

COMMIT;
