ARG NODE_VERSION=22.14.0
ARG PNPM_VERSION=10.5.0

# Stage 1: Build
FROM node:${NODE_VERSION}-alpine AS builder
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_URL

WORKDIR /usr/src/app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/frontend/package.json ./apps/frontend/

RUN npm install -g pnpm@${PNPM_VERSION} && pnpm install --frozen-lockfile --filter frontend...
COPY apps/frontend ./apps/frontend
WORKDIR /usr/src/app/apps/frontend
RUN pnpm build

# Stage 2: Serve (Nginx)
FROM nginx:alpine

# 빌드된 결과물(dist)을 Nginx가 서빙할 폴더로 복사
COPY --from=builder /usr/src/app/apps/frontend/dist /usr/share/nginx/html

# Nginx 설정
COPY infra/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]