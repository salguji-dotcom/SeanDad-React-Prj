# SeanDad 웹 화면 표준 (요약)

원본: docs/standard/SD-STD-UI-001_웹화면표준지침서.pdf, 샘플: SD-STD-UI-002_웹화면샘플.pdf
화면 코드를 만들거나 고칠 때 아래 규칙을 반드시 따른다. 규칙에 없는 판단이 필요하면 임의로 정하지 말고 먼저 질문한다.

## 기술
- React 18 + Vite, 함수형 컴포넌트와 Hook만 사용 (클래스 컴포넌트 금지)
- 라우팅 React Router v6 / 서버 상태 TanStack Query / 폼 React Hook Form + zod / 전역 UI Zustand
- HTTP는 src/api/client.js 공통 인스턴스만 사용. 업무 화면에서 axios 직접 import 금지
- 스타일은 CSS Modules + src/styles/tokens.css 토큰만. 인라인 style, 색상 값 하드코딩 금지

## 화면 ID·파일·URL
- 화면 ID 7자리: 업무코드2 + 메뉴2 + 순번2 + 유형1 (L 목록, D 상세, R 등록/수정, P 팝업, M 대시보드). 예: SY0101L
- 파일: src/pages/{업무코드 소문자}/{리소스}/{화면ID}.jsx, 컴포넌트명 = 화면 ID
- PageHeader의 screenId = 화면 ID
- URL: 목록 /{업무}/{리소스복수}, 상세 /:id, 등록 /new, 수정 /:id/edit (소문자, 하이픈)
- API 함수: src/api/{업무코드}/{리소스}Api.js, 화면에서는 Query Hook으로 감싸 사용
- API·컬럼 필드명은 DB 컬럼(용어사전)의 camelCase (cust_no → custNo)

## 화면 유형
- 목록(L): PageHeader → SearchPanel → 그리드 상단 바(총 건수 / 버튼) → DataGrid → Pagination. 진입 시 기본 조건 자동 조회, 행 클릭 → 상세
- 상세(D): 섹션 Card + 2열 라벨-값(라벨 140px). 하단 왼쪽 [목록], 오른쪽 [삭제][수정]
- 등록·수정(R): 한 컴포넌트, :id 유무로 모드 구분. 상세와 같은 섹션·순서. 하단 오른쪽 [취소][저장]. 변경 후 이탈 시 W003 (useDirtyGuard)
- 팝업(P): 공통 Modal, 크기 s 480 / m 720 / l 960. ESC·X로 닫기, 딤 클릭으로 닫지 않음. 결과는 onSelect(row). window.open 금지
- 목록 검색 조건·페이지·정렬은 URL 쿼리스트링에 저장

## 공통 컴포넌트
- button/input/select/table을 직접 스타일링해 쓰지 말고 공통 컴포넌트 사용: Button, PageHeader, Card, SearchPanel, FormField, Input, Textarea, CodeSelect, Checkbox, Radio, DatePicker, DateRangePicker, DataGrid, Pagination, Modal, StatusBadge
- 공통에 없는 기능이 필요하면 업무 화면에서 새로 만들지 말고 먼저 제안한다

## 버튼
- 유형: primary(주요 동작 1개만) / secondary / danger(삭제·중지, 실행 전 확인) / text
- 표준 명칭만 사용: 조회, 초기화, 신규, 저장, 수정, 삭제, 취소, 목록, 선택, 닫기, 엑셀 다운로드
- 주요 버튼은 항상 가장 오른쪽. 검색 [초기화][조회] / 그리드 상단 [엑셀 다운로드][삭제][신규] / 팝업 [닫기][선택]
- 권한 없는 버튼은 숨김(usePermission), 조건 미충족은 비활성. 처리 중에는 <Button loading>

## 입력·검증
- 필수 항목은 FormField required(빨간 *). placeholder는 형식 예시로만
- 검증은 화면별 zod 스키마(xxxSchema.js)에 정의. blur 시 해당 칸, 저장 시 전체 검증 후 첫 오류 칸으로 포커스
- maxLength는 용어사전 도메인 길이와 동일
- 전화·사업자번호·금액은 표시용 마스크, 서버로는 숫자만 전송. 저장 시 trim

## 그리드
- 컬럼 순서: [체크] No → 키 → 명칭 → 속성 → 상태 → 등록일시
- 정렬: 문자 왼쪽, 숫자·금액 오른쪽, 코드·날짜·상태·No 가운데. 헤더 가운데
- 서버 페이징, 기본 20건(10·20·50·100), 기본 정렬 등록일시 내림차순, 총 건수 "총 N건"
- 상태는 StatusBadge(색 + 글자), 코드값 그대로 노출 금지. columns 정의는 파일 상단에 모음

## 표시 형식 (utils/format.js만 사용)
- 날짜 YYYY-MM-DD, 일시 YYYY-MM-DD HH:mm:ss, 금액 1,234,567, 비율 12.5%, 전화 010-1234-5678
- 값 없음은 "-", Y/N·코드는 공통코드 명칭(useCode)으로 표시
- 개인정보는 서버가 마스킹한 값을 그대로 표시 (화면에서 원본을 받아 가리지 않음)

## 메시지
- 문구는 constants/messages.js 코드로만 호출 (C 확인, I 정보, W 경고, E 오류). 화면에 문구 직접 작성 금지
- 성공 알림은 toast(I001 저장, I002 삭제), 실행 전 확인은 useConfirm(C001 저장, C002 삭제)
- alert(), confirm() 사용 금지
- 새 문구가 필요하면 존댓말·짧게·기술 용어 없이 작성하고 코드 번호를 제안한다

## 상태 처리
- 조회 중: DataGrid loading(스켈레톤), 빈 데이터: I003 안내
- HTTP 오류는 client.js 인터셉터에서 공통 처리(401 → E002 로그인, 403 → E003, 5xx → E001). 화면에서 같은 오류를 다시 띄우지 않음

## 코드 품질
- 파일 하나에 export 컴포넌트 하나, 250줄 넘으면 분리. 목록 key는 고유 ID (인덱스 금지)
- 서버 데이터를 useState·Zustand에 복사하지 않음
- console.log, dangerouslySetInnerHTML 커밋 금지
- 작업을 마치면 npm run lint, npm run build를 실행해 통과를 확인한다
