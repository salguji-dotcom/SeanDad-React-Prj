-- 공통코드 (화면의 코드 표시·선택 항목: useCode, CodeSelect, StatusBadge)
-- IF NOT EXISTS / ON CONFLICT 로 작성되어 기존 DB에도 그대로 실행할 수 있습니다.
-- 실행: docker compose exec -T db psql -U app -d appdb -v ON_ERROR_STOP=1 < db/init/03_com_cd.sql

-- 공통코드그룹
CREATE TABLE IF NOT EXISTS tb_com_cd_group (
    group_cd    VARCHAR(12)  NOT NULL,
    group_cd_nm VARCHAR(100) NOT NULL,
    use_yn      VARCHAR(1)   NOT NULL DEFAULT 'Y' CHECK (use_yn IN ('Y', 'N')),
    reg_dt      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    mdfcn_dt    TIMESTAMP,
    CONSTRAINT tb_com_cd_group_pk PRIMARY KEY (group_cd)
);

COMMENT ON TABLE  tb_com_cd_group             IS '공통코드그룹';
COMMENT ON COLUMN tb_com_cd_group.group_cd    IS '그룹코드';
COMMENT ON COLUMN tb_com_cd_group.group_cd_nm IS '그룹코드명';
COMMENT ON COLUMN tb_com_cd_group.use_yn      IS '사용여부';
COMMENT ON COLUMN tb_com_cd_group.reg_dt      IS '등록일시';
COMMENT ON COLUMN tb_com_cd_group.mdfcn_dt    IS '수정일시';

-- 공통코드
CREATE TABLE IF NOT EXISTS tb_com_cd (
    group_cd VARCHAR(12)  NOT NULL,
    cd       VARCHAR(10)  NOT NULL,
    cd_nm    VARCHAR(100) NOT NULL,
    sort_seq NUMERIC(10)  NOT NULL DEFAULT 0,
    use_yn   VARCHAR(1)   NOT NULL DEFAULT 'Y' CHECK (use_yn IN ('Y', 'N')),
    reg_dt   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    mdfcn_dt TIMESTAMP,
    CONSTRAINT tb_com_cd_pk PRIMARY KEY (group_cd, cd),
    CONSTRAINT tb_com_cd_fk01 FOREIGN KEY (group_cd) REFERENCES tb_com_cd_group (group_cd)
);

COMMENT ON TABLE  tb_com_cd          IS '공통코드';
COMMENT ON COLUMN tb_com_cd.group_cd IS '그룹코드';
COMMENT ON COLUMN tb_com_cd.cd       IS '코드';
COMMENT ON COLUMN tb_com_cd.cd_nm    IS '코드명';
COMMENT ON COLUMN tb_com_cd.sort_seq IS '정렬순서';
COMMENT ON COLUMN tb_com_cd.use_yn   IS '사용여부';
COMMENT ON COLUMN tb_com_cd.reg_dt   IS '등록일시';
COMMENT ON COLUMN tb_com_cd.mdfcn_dt IS '수정일시';

-- 초기 데이터
INSERT INTO tb_com_cd_group (group_cd, group_cd_nm) VALUES
    ('USE_YN',  '사용여부'),
    ('YN',      '여부'),
    ('DSCD_YN', '폐기여부')
ON CONFLICT (group_cd) DO NOTHING;

INSERT INTO tb_com_cd (group_cd, cd, cd_nm, sort_seq) VALUES
    ('USE_YN',  'Y', '사용',   1),
    ('USE_YN',  'N', '미사용', 2),
    ('YN',      'Y', '예',     1),
    ('YN',      'N', '아니요', 2),
    ('DSCD_YN', 'N', '정상',   1),
    ('DSCD_YN', 'Y', '폐기',   2)
ON CONFLICT (group_cd, cd) DO NOTHING;
