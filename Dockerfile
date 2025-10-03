# Multi-stage Dockerfile for Yellow Cross Platform

# Stage 1: Base
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl postgresql-client

# Stage 2: Dependencies
FROM base AS dependencies
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 3: Development Dependencies
FROM base AS dev-dependencies
COPY package*.json ./
RUN npm ci && \
    npm cache clean --force

# Stage 4: Build
FROM dev-dependencies AS build
COPY backend ./backend
COPY package*.json ./
RUN cd backend && npx prisma generate

# Stage 5: Development
FROM base AS development
WORKDIR /app
COPY --from=dev-dependencies /app/node_modules ./node_modules
COPY backend ./backend
COPY package*.json ./
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Stage 6: Production
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/backend ./backend
COPY package*.json ./
RUN cd backend && npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
