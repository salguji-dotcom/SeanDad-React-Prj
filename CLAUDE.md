# CLAUDE.md

이 저장소에서 작업할 때 따르는 규칙입니다. 답변과 주석은 한국어로 작성합니다.

## 프로젝트 개요

| 구분 | 기술 |
|---|---|
| 백엔드 | Spring Boot 3.5 / Java 17 / Gradle (`backend/`, 패키지 `com.seandad.app`) |
| DB 연동 | MyBatis (XML 매퍼: `backend/src/main/resources/mapper/`) |
| 프론트엔드 | React 18 + Vite + React Router (`frontend/`) |
| DB | PostgreSQL 16 (초기 스키마: `db/init/`) |
| 실행/배포 | Docker Compose, Jenkins (`Jenkinsfile`) |

## 자주 쓰는 명령

```bash
# 전체 실행 (frontend :3000, backend :8080, db :5433)
docker compose up -d --build

# 백엔드 테스트 / 로컬 실행 (로컬 실행 시 DB 포트 5433)
cd backend && ./gradlew test
cd backend && DB_URL=jdbc:postgresql://localhost:5433/appdb ./gradlew bootRun

# 프론트엔드 개발 서버 (/api → localhost:8080 프록시)
cd frontend && npm run dev
```

- `db/init/*.sql`은 DB 볼륨이 처음 만들어질 때만 실행됩니다. 스키마를 바꾸면 변경 SQL을 직접 실행하거나, 데이터 삭제를 감수하고 `docker compose down -v` 후 다시 띄웁니다. `down -v`는 사용자 확인 없이 실행하지 않습니다.

## 기능 추가 구조

기능 단위 패키지로 나눕니다. (예: `item`)

- 백엔드: `com.seandad.app.<기능>` 아래 `Controller`, `Service`, `Mapper`(인터페이스), DTO/VO
- SQL: `mapper/<기능>Mapper.xml` (SQL은 XML에만 작성, 어노테이션 SQL 사용 안 함)
- API 경로: `/api/<기능 복수형>` (예: `/api/items`)
- 프론트엔드: `src/api/<기능>Api.js`, `src/pages/<화면>Page.jsx`, 라우트는 `src/App.jsx`에 등록하고 대시보드(`DashboardPage.jsx`)에 바로가기를 추가
- 새 기능에는 컨트롤러 테스트(`@WebMvcTest`)를 함께 작성

## 데이터 표준화 규칙 (필수)

DB 객체 이름은 **공공데이터 공통표준**(용어·단어·도메인)을 따릅니다.

표준 사전은 이 프로젝트의 기능(`std`)으로 관리합니다.
- 원본 엑셀: `docs/standards/TB_용어.xlsx`, `TB_단어.xlsx`, `TB_도메인.xlsx`
- DB: `tb_std_trm`(표준용어), `tb_std_word`(표준단어), `tb_std_dmn`(표준도메인) — `db/init/02_std.sql`
- 화면: http://localhost:3000/std (용어 확인, 검색, 엑셀 업로드)
- DB가 비어 있으면(새 볼륨) 먼저 엑셀을 적재합니다. 화면의 "엑셀 업로드" 또는:

```bash
cd docs/standards && curl -s -X POST localhost:8080/api/std/import -F "trmFile=@TB_용어.xlsx" -F "wordFile=@TB_단어.xlsx" -F "dmnFile=@TB_도메인.xlsx"
```

Claude가 조회할 때는 **PowerShell**을 씁니다. (Git Bash의 curl은 한글 인자가 CP949로 깨집니다.)

```powershell
$api = 'http://localhost:8080/api/std'; $q = { [uri]::EscapeDataString($args[0]) }
# 표준용어 확인, 없으면 단어 조합으로 신규 용어 제안 (standard / valid / engAbbrNm / dmnNm / dmnCandidates / messages)
Invoke-RestMethod "$api/terms/suggest?trmNm=$(& $q '등록자아이디')" | ConvertTo-Json -Depth 4
Invoke-RestMethod "$api/terms?keyword=$(& $q '등록일시')"     # 용어 검색 (한글명/영문약어, 최대 100건)
Invoke-RestMethod "$api/words?keyword=$(& $q '아이디')"       # 단어 검색 (이음동의어·금칙어 포함)
Invoke-RestMethod "$api/domains?keyword=$(& $q '명')"         # 도메인 검색 (빈 값이면 전체)
# 폐기 항목까지 보려면 &includeDiscarded=true
```

- 앱이 떠 있지 않으면 `docker compose up -d`로 먼저 띄웁니다.
- 판정 로직은 `backend/.../std/StdService.java`의 `suggest`에 있습니다.

### 컬럼 이름 정하는 순서

1. **표준용어 사전에 있으면 그대로 사용합니다.** 한글 용어명, 영문약어명, 도메인을 모두 사전대로 씁니다.
2. **없으면 표준단어를 조합해 신규 용어를 만듭니다** (`/api/std/terms/suggest`).
   - 영문약어명은 단어 약어를 `_`로 연결합니다. (등록자 + 아이디 → `RGTR_ID`)
   - 용어는 **형식단어**(명, 번호, 일련번호, 일시, 일자, 여부, 코드, 내용, 금액, 수 등)로 끝나야 합니다.
   - 도메인은 마지막 형식단어의 도메인 분류 안에서 고릅니다.
   - **이음동의어·금칙어는 쓰지 않고 표준단어로 바꿉니다.** (유저 → 사용자, 시퀀스 → 일련번호)
3. **표준단어에도 없으면 임의로 만들지 않습니다.** 사용자에게 신규 단어(한글명, 영문약어, 영문명) 등록 여부를 먼저 묻습니다.
4. 제정차수에 `(폐기)`가 붙은 항목(`dscd_yn = 'Y'`)은 사용하지 않습니다. (조회 API는 기본으로 제외)
5. 신규 용어나 신규 단어를 만들었으면 작업 결과에 목록으로 알려 줍니다.

### 테이블 이름

- `TB_` + 표준단어 영문약어 조합을 씁니다. (품목 → `TB_ITEM`) — 프로젝트 규칙입니다.
- 테이블명의 한글 이름도 표준단어 조합으로 정하고 `COMMENT ON TABLE`에 적습니다.

### PostgreSQL 작성 규칙

- 식별자는 따옴표 없이 **소문자 스네이크 케이스**로 씁니다. (`ITEM_NM` → `item_nm`)
- 모든 테이블과 컬럼에 한글 표준용어명으로 `COMMENT ON`을 작성합니다.
- 도메인 → PostgreSQL 타입 매핑:

| 도메인 | PostgreSQL 타입 |
|---|---|
| `명V100`, `내용V4000`, `번호V20` 등 (V/C, 문자) | `VARCHAR(길이)` |
| `여부C1`, `유무C1` | `VARCHAR(1)` + `CHECK (... IN ('Y','N'))` |
| `금액N15`, `수N10`, `율N5,2` 등 (N, 숫자) | `NUMERIC(길이[,소수점])` |
| `일련번호N10`/`N22` 를 기본키로 쓸 때 | `BIGINT GENERATED ALWAYS AS IDENTITY` |
| `연월일시분초D` | `TIMESTAMP` |
| `연월일C8`, `연월C6`, `시분C4` 등 | 도메인의 데이터타입·길이 그대로 (`VARCHAR`/`CHAR`) |

> 표준 도메인 중 일부 숫자(N) 도메인은 데이터타입이 `VARCHAR`로 정의되어 있지만, 이 프로젝트에서는 계산·정렬을 위해 `NUMERIC`으로 매핑합니다.

### 공통 컬럼 (표준용어)

| 용어 | 컬럼 | 도메인 |
|---|---|---|
| 등록일시 | `reg_dt` | 연월일시분초D |
| 수정일시 | `mdfcn_dt` | 연월일시분초D |
| 사용여부 | `use_yn` | 여부C1 |
| 삭제여부 | `del_yn` | 여부C1 |

### 애플리케이션 코드 이름

- MyBatis는 `map-underscore-to-camel-case: true`이므로 Java 필드, DTO, API JSON 키는 컬럼명의 camelCase를 그대로 씁니다. (`item_nm` → `itemNm`, `reg_dt` → `regDt`)
- 프론트엔드에서도 API 응답 키를 그대로 사용하고, 화면 라벨은 한글 표준용어명을 씁니다.
- 클래스·패키지·URL 같은 코드 구조 이름은 일반 영어 단어를 써도 됩니다. (예: `ItemController`, `/api/items`)

## Git

- 원격: `origin` = https://github.com/salguji-dotcom/SeanDad-React-Prj (기본 브랜치 `main`)
- 커밋 메시지는 영어 명령형 한 줄 요약 + 필요 시 본문
- 개인 메모 파일(예: `작업_*.txt`)과 `.env`는 커밋하지 않습니다.
- 커밋과 push는 사용자가 요청할 때만 합니다.
