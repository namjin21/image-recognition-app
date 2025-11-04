# Image-Tagger
**Image Tagger**는 사용자가 이미지를 업로드하고 AI가 자동으로 태그를 생성해주는 웹 애플리케이션입니다.  
AWS 인프라를 기반으로 **보안성 있는 이미지 업로드/다운로드(Pre-signed URL)**, **사용자별 데이터 분리(Cognito + DynamoDB)**, 그리고 **S3를 통한 스토리지 관리**를 구현했습니다.

## 주요 기능
- **이미지 업로드 및 자동 라벨링**
  - 사용자가 이미지를 업로드하면 AI가 자동으로 이미지에 대한 태그를 생성.
- **보안 업로드 & 다운로드**
  - S3 Pre-signed URL을 이용해 인증된 사용자만 업로드/다운로드 가능.
- **사용자 인증**
  - AWS Cognito를 통해 사용자 로그인 및 인증 토큰 발급.
- **확장 가능한 클라우드 인프라**
  - 이미지 및 메타데이터는 각각 S3와 DynamoDB에 저장.

## 기술 스택
| 영역           | 기술                                     |
| ------------ | -------------------------------------- |
| **Frontend** | React, TypeScript, Vite, Axios         |
| **Backend**  | Node.js, Express, AWS SDK v3           |
| **Auth**     | AWS Cognito                            |
| **Storage**  | AWS S3, DynamoDB                       |
| **Infra**    | pnpm Monorepo                          |

## 📝 API Endpoints

1. **이미지 업로드**

| Endpoint  | Method |  설명                                 |
| --------- | ------ |  ---------------------------------- |
| `/upload` | POST   |  이미지 파일 업로드 (필드명: `images`) |

2. **이미지 처리**

| Endpoint   | Method |  설명                                    |
| ---------- | ------ | ------------------------------------- |
| `/process` | POST   | 업로드된 이미지를 분석하고 태그 생성 (`processImage`) |

3. **이미지 메타데이터 조회**

| Endpoint                | Method | 설명                                           |
| ----------------------- | ------ | -------------------------------------------- |
| `/metadata/:imageId`    | GET    | 특정 이미지의 메타데이터 조회 (`fetchMetadata`)           |
| `/metadata/all/:userId` | GET    | 특정 사용자의 모든 이미지 메타데이터 조회 (`fetchAllMetadata`) |

4. **이미지 삭제**

| Endpoint          | Method | 설명                              |
| ----------------- | ------ | ------------------------------- |
| `/images/:userId` | DELETE | 특정 사용자의 이미지 삭제 (`deleteImages`) |

