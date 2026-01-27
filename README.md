# 📸 ImageTeller (구 Image Tagger)

> **AI 기반의 이미지 분석 및 감성 일기 생성 서비스** > 사용자가 업로드한 이미지를 분석하고, 이를 바탕으로 OpenAI(GPT)가 오늘의 기록을 자동으로 생성해주는 웹 애플리케이션입니다.

<br/>

## 📖 프로젝트 소개

**ImageTeller**는 단순한 이미지 저장소를 넘어, 시각적 기억을 텍스트로 기록해주는 서비스입니다. AWS 클라우드 인프라와 Docker 컨테이너 환경을 기반으로 구축되었으며, **보안성 있는 이미지 처리(Pre-signed URL)**, **사용자별 데이터 격리**, **Nginx 리버스 프록시**를 통한 안정적인 서비스를 제공합니다.

### 🌊 주요 흐름
1. **Upload:** 사용자가 이미지를 업로드 (S3 Pre-signed URL 활용)
2. **Analyze:** AWS Rekognition이 이미지 내 객체와 풍경을 분석하여 태그 추출
3. **Storytelling:** 추출된 태그를 바탕으로 **OpenAI(GPT)**가 감성적인 1인칭 시점의 일기 생성
4. **Archiving:** 사진과 생성된 스토리를 카드 형태로 저장 및 조회

<br/>

## ✨ 주요 기능

- **🤖 AI 이미지 분석 & 스토리텔링**
  - AWS Rekognition을 활용한 정밀한 태그 추출
  - OpenAI(GPT-4o) 프롬프트 엔지니어링을 통한 상황별 맞춤 일기 생성
- **🔒 보안 업로드 & 다운로드**
  - AWS S3 Pre-signed URL을 적용하여 서버 부하 감소 및 보안 강화
- **🔐 사용자 인증 및 데이터 보호**
  - AWS Cognito를 통한 안전한 로그인/회원가입
  - DynamoDB를 활용한 사용자별 데이터 철저 격리 (Multi-tenancy support)
- **🐳 Docker & Cloud Infra**
  - Docker Compose를 활용한 컨테이너 기반의 개발/배포 환경 표준화
  - Nginx Reverse Proxy 적용으로 내부망 통신 구현 및 보안성 증대

<br/>

## 🛠 기술 스택

| 영역 | 기술 스택 |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite, TailwindCSS, Axios |
| **Backend** | Node.js, Express, AWS SDK v3 |
| **AI** | **OpenAI API (GPT-4o)**, AWS Rekognition |
| **Auth** | AWS Cognito |
| **Storage** | AWS S3, DynamoDB |
| **DevOps** | **Docker, Docker Compose, Nginx**, GitHub Actions |

<br/>

## 📝 API Endpoints

모든 API는 RESTful 원칙에 따라 설계되었으며, 기본 경로는 `/api/images`입니다.

**Base URL:** `/api/images`

| Method | Endpoint | 설명 |
| :---: | :--- | :--- |
| **POST** | `/presigned` | **이미지 업로드 URL 요청**<br>S3 업로드를 위한 1회용 Pre-signed URL 발급 |
| **POST** | `/finalize` | **업로드 완료 처리**<br>S3 업로드 성공 후, DB에 메타데이터 저장 |
| **POST** | `/:imageId/analyze` | **AI 분석 및 스토리 생성**<br>이미지 태그 추출(Rekognition) 및 일기 생성(OpenAI) 요청 |
| **GET** | `/` | **전체 이미지 조회**<br>사용자의 모든 이미지 목록과 생성된 스토리 조회 |
| **GET** | `/:imageId` | **단일 이미지 조회**<br>특정 이미지의 상세 정보 및 태그 조회 |
| **DELETE** | `/` | **이미지 삭제**<br>선택한 이미지(들)를 S3와 DB에서 영구 삭제 |

<br/>


## 🚀 설치 및 실행

이 프로젝트는 **Docker를 이용한 통합 실행**과 **Monorepo 기반의 개별 실행**을 모두 지원합니다.

### 사전 준비 (Prerequisites)
- Node.js v18+
- pnpm (`npm install -g pnpm`)
- Docker & Docker Compose (Docker 실행 시 필요)
---

### 방법 1. Docker로 실행하기 (권장 - 인프라 환경)
실제 배포 환경과 가장 유사하게 실행됩니다. Nginx, Backend, Frontend가 모두 컨테이너로 동작합니다.

**1. 환경 변수 설정**
`infra` 폴더 내에 `.env` 파일을 생성합니다. (참고: `infra/.env.example`)

**2. 컨테이너 실행**
```bash
cd infra
docker-compose up --build
```
**3. 접속**
브라우저에서 `http://localhost`로 접속합니다. (Nginx가 80번 포트에서 라우팅을 담당합니다.)

---

### 방법 2. 로컬에서 직접 실행하기 (개발용)
빠른 UI 수정이나 디버깅이 필요할 때 유용합니다.

**1. 의존성 설치**
루트 디렉토리에서 전체 패키지를 설치합니다.
```bash
pnpm install
```
**2. 환경 변수 설정**
 각 앱 폴더(apps/backend, apps/frontend)에 .env 파일을 생성합니다.

 **3. 백엔드 실행**
```
# 터미널 1
pnpm --filter backend start
# 또는 cd apps/backend && pnpm start
```
Backend Server는 http://localhost:3000 에서 실행됩니다.

 **4. 프론트엔드 실행**
```
# 터미널 2
pnpm --filter frontend dev
# 또는 cd apps/frontend && pnpm dev
```
Frontend Dev Server는 http://localhost:5173 (Vite 기본 포트)에서 실행됩니다.

## 📂 폴더 구조
```
root
├── apps
│   ├── frontend  # React App (Vite)
│   └── backend   # Express Server
├── infra         # Docker, Nginx, Docker-compose 설정
└── packages      # Shared Configs (ESLint, TSConfig 등)