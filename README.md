# SeanDad React Project

| 구분 | 기술 |
|---|---|
| 백엔드 | Spring Boot 3.5 / Java 17 / Gradle |
| DB 연동 | MyBatis |
| 프론트엔드 | React 18 + Vite |
| DB | PostgreSQL 16 |
| 형상관리 | Git |
| CI/CD | Jenkins (`Jenkinsfile`) |
| 실행환경 | Docker / Docker Compose |

## 디렉터리 구조

```
backend/     Spring Boot API (com.seandad.app)
  src/main/java/com/seandad/app/item/   샘플 기능 (controller / service / mapper)
  src/main/resources/mapper/            MyBatis XML
frontend/    React + Vite (개발 시 /api → localhost:8080 프록시)
db/init/     PostgreSQL 초기 스키마 (컨테이너 최초 기동 시 실행)
docker-compose.yml
Jenkinsfile
```

## 사전 설치

- JDK 17
- Node.js 22
- Docker Desktop

## 실행 방법

### 1) Docker로 전체 실행

```bash
cp .env.example .env
docker compose up -d --build
```

- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:8080/api/items
- 헬스체크: http://localhost:8080/actuator/health

### 2) 로컬 개발 (DB만 Docker)

```bash
docker compose up -d db
```

백엔드: IntelliJ에서 `backend` 폴더를 Gradle 프로젝트로 열고 `AppApplication` 실행, 또는

```bash
cd backend
./gradlew bootRun
```

테스트: `./gradlew test`

프론트엔드:

```bash
cd frontend
npm install
npm run dev
```

http://localhost:5173 접속

## 새 기능 추가 순서

1. `db/init` 또는 마이그레이션 SQL에 테이블 추가
2. `backend/.../<기능>/` 에 DTO, Mapper 인터페이스, Service, Controller 작성
3. `backend/src/main/resources/mapper/<기능>Mapper.xml` 에 SQL 작성
4. `frontend/src/api/` 에 API 함수, 화면 컴포넌트 작성
