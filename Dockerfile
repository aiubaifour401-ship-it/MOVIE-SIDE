# Multi-Stage Enterprise Production Dockerfile for Cineverse OTT Platform
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-舆-cache python3 make g++ ffmpeg

# Copy dependency definitions
COPY package.json bun.lock* ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build production assets and bundle server.cjs
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install FFmpeg and runtime essentials
RUN apk add --no-cache ffmpeg ca-certificates curl

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose HTTP Port
EXPOSE 3000

# Health Check Probe
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start Production Server Entrypoint
CMD ["node", "dist/server.cjs"]
