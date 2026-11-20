-- 공통표준 사전 (용어/단어/도메인)
-- 데이터는 화면(/std > 엑셀 업로드) 또는 POST /api/std/import 로 적재합니다.
-- IF NOT EXISTS 로 작성되어 기존 DB에도 그대로 실행할 수 있습니다.
-- 실행: docker compose exec -T db psql -U app -d appdb -v ON_ERROR_STOP=1 < db/init/02_std.sql

-- 표준단어
CREATE TABLE IF NOT EXISTS tb_std_word (
    word_sn      BIGINT        NOT NULL,
    enct_cycl_nm VARCHAR(100),
    word_nm      VARCHAR(300)  NOT NULL,
    eng_abbr_nm  VARCHAR(300)  NOT NULL,
    eng_nm       VARCHAR(100),
    word_expln   VARCHAR(4000),
    frm_word_yn  VARCHAR(1)    NOT NULL DEFAULT 'N' CHECK (frm_word_yn IN ('Y', 'N')),
    dmn_clsf_nm  VARCHAR(100),
    synm_cn      VARCHAR(1000),
    phwrd_cn     VARCHAR(1000),
    dscd_yn      VARCHAR(1)    NOT NULL DEFAULT 'N' CHECK (dscd_yn IN ('Y', 'N')),
    reg_dt       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tb_std_word_pk PRIMARY KEY (word_sn)
);

COMMENT ON TABLE  tb_std_word              IS '표준단어';
COMMENT ON COLUMN tb_std_word.word_sn      IS '단어일련번호';
COMMENT ON COLUMN tb_std_word.enct_cycl_nm IS '제정차수명';
COMMENT ON COLUMN tb_std_word.word_nm      IS '단어명';
COMMENT ON COLUMN tb_std_word.eng_abbr_nm  IS '영문약어명';
COMMENT ON COLUMN tb_std_word.eng_nm       IS '영문명';
COMMENT ON COLUMN tb_std_word.word_expln   IS '단어설명';
COMMENT ON COLUMN tb_std_word.frm_word_yn  IS '형식단어여부';
COMMENT ON COLUMN tb_std_word.dmn_clsf_nm  IS '도메인분류명';
COMMENT ON COLUMN tb_std_word.synm_cn      IS '동의어내용';
COMMENT ON COLUMN tb_std_word.phwrd_cn     IS '금칙어내용';
COMMENT ON COLUMN tb_std_word.dscd_yn      IS '폐기여부';
COMMENT ON COLUMN tb_std_word.reg_dt       IS '등록일시';

CREATE INDEX IF NOT EXISTS tb_std_word_i01 ON tb_std_word (word_nm);

-- 표준용어
CREATE TABLE IF NOT EXISTS tb_std_trm (
    trm_sn           BIGINT        NOT NULL,
    enct_cycl_nm     VARCHAR(100),
    trm_nm           VARCHAR(300)  NOT NULL,
    trm_expln        VARCHAR(4000),
    eng_abbr_nm      VARCHAR(300)  NOT NULL,
    dmn_nm           VARCHAR(100),
    prm_vl_cn        VARCHAR(1000),
    strg_frm_nm      VARCHAR(100),
    indct_frm_nm     VARCHAR(100),
    pbadms_std_cd_nm VARCHAR(100),
    jrsd_inst_nm     VARCHAR(200),
    synm_cn          VARCHAR(1000),
    dscd_yn          VARCHAR(1)    NOT NULL DEFAULT 'N' CHECK (dscd_yn IN ('Y', 'N')),
    reg_dt           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tb_std_trm_pk PRIMARY KEY (trm_sn)
);

COMMENT ON TABLE  tb_std_trm                  IS '표준용어';
COMMENT ON COLUMN tb_std_trm.trm_sn           IS '용어일련번호';
COMMENT ON COLUMN tb_std_trm.enct_cycl_nm     IS '제정차수명';
COMMENT ON COLUMN tb_std_trm.trm_nm           IS '용어명';
COMMENT ON COLUMN tb_std_trm.trm_expln        IS '용어설명';
COMMENT ON COLUMN tb_std_trm.eng_abbr_nm      IS '영문약어명';
COMMENT ON COLUMN tb_std_trm.dmn_nm           IS '도메인명';
COMMENT ON COLUMN tb_std_trm.prm_vl_cn        IS '허용값내용';
COMMENT ON COLUMN tb_std_trm.strg_frm_nm      IS '저장형식명';
COMMENT ON COLUMN tb_std_trm.indct_frm_nm     IS '표시형식명';
COMMENT ON COLUMN tb_std_trm.pbadms_std_cd_nm IS '행정표준코드명';
COMMENT ON COLUMN tb_std_trm.jrsd_inst_nm     IS '소관기관명';
COMMENT ON COLUMN tb_std_trm.synm_cn          IS '동의어내용';
COMMENT ON COLUMN tb_std_trm.dscd_yn          IS '폐기여부';
COMMENT ON COLUMN tb_std_trm.reg_dt           IS '등록일시';

CREATE INDEX IF NOT EXISTS tb_std_trm_i01 ON tb_std_trm (trm_nm);
CREATE INDEX IF NOT EXISTS tb_std_trm_i02 ON tb_std_trm (eng_abbr_nm);

-- 표준도메인
CREATE TABLE IF NOT EXISTS tb_std_dmn (
    dmn_sn        BIGINT        NOT NULL,
    enct_cycl_nm  VARCHAR(100),
    dmn_group_nm  VARCHAR(100),
    dmn_clsf_nm   VARCHAR(100),
    dmn_nm        VARCHAR(100)  NOT NULL,
    dmn_expln     VARCHAR(4000),
    data_type_nm  VARCHAR(300),
    data_len      NUMERIC(10),
    data_dcpt_len NUMERIC(10),
    strg_frm_nm   VARCHAR(100),
    indct_frm_nm  VARCHAR(100),
    unit_nm       VARCHAR(100),
    prm_vl_cn     VARCHAR(1000),
    dscd_yn       VARCHAR(1)    NOT NULL DEFAULT 'N' CHECK (dscd_yn IN ('Y', 'N')),
    reg_dt        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tb_std_dmn_pk PRIMARY KEY (dmn_sn)
);

COMMENT ON TABLE  tb_std_dmn               IS '표준도메인';
COMMENT ON COLUMN tb_std_dmn.dmn_sn        IS '도메인일련번호';
COMMENT ON COLUMN tb_std_dmn.enct_cycl_nm  IS '제정차수명';
COMMENT ON COLUMN tb_std_dmn.dmn_group_nm  IS '도메인그룹명';
COMMENT ON COLUMN tb_std_dmn.dmn_clsf_nm   IS '도메인분류명';
COMMENT ON COLUMN tb_std_dmn.dmn_nm        IS '도메인명';
COMMENT ON COLUMN tb_std_dmn.dmn_expln     IS '도메인설명';
COMMENT ON COLUMN tb_std_dmn.data_type_nm  IS '자료유형명';
COMMENT ON COLUMN tb_std_dmn.data_len      IS '자료길이';
COMMENT ON COLUMN tb_std_dmn.data_dcpt_len IS '자료소수점길이';
COMMENT ON COLUMN tb_std_dmn.strg_frm_nm   IS '저장형식명';
COMMENT ON COLUMN tb_std_dmn.indct_frm_nm  IS '표시형식명';
COMMENT ON COLUMN tb_std_dmn.unit_nm       IS '단위명';
COMMENT ON COLUMN tb_std_dmn.prm_vl_cn     IS '허용값내용';
COMMENT ON COLUMN tb_std_dmn.dscd_yn       IS '폐기여부';
COMMENT ON COLUMN tb_std_dmn.reg_dt        IS '등록일시';
