# Cineverse OTT Platform — Production Deployment Guide

## Overview
This document outlines the enterprise deployment architecture, orchestration, and operational procedures for running the Cineverse OTT platform at multi-million user scale.

## Infrastructure Stack
1. **Container Runtime**: Multi-stage Docker containers (`Dockerfile`) with FFmpeg and Node.js runtime.
2. **Orchestration**: Kubernetes (`/kubernetes`) with Rolling Updates and Horizontal Pod Autoscalers (HPA).
3. **Ingress & Proxy**: NGINX (`/nginx`) with HTTP/2, SSL Termination, Brotli compression, and HLS media segment caching.
4. **Caching & Queues**: Redis cluster for session state, recommendation caches, and BullMQ transcode jobs.
5. **Database**: PostgreSQL Primary with Read Replicas and Connection Pooling (PgBouncer).
6. **CI/CD Pipeline**: GitHub Actions (`/.github/workflows/deploy.yml`) for automated testing, container registry push, and zero-downtime rolling deployments.

## Quick Start (Docker Compose Production Simulation)
```bash
# Build and launch complete production stack
docker-compose -f docker-compose.yml up -d --build

# Inspect running services
docker-compose ps

# Monitor logs
docker-compose logs -f cineverse-app
```

## Kubernetes Deployment
```bash
# Apply ConfigMap & Secrets
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secrets.yaml

# Deploy Backend & Services
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/ingress.yaml
kubectl apply -f kubernetes/hpa.yaml

# Verify Rollout
kubectl rollout status deployment/cineverse-backend-deployment -n cineverse-production
```

## Monitoring & Health Probes
- Liveness Probe: `GET /api/health/liveness`
- Readiness Probe: `GET /api/health/readiness`
- System Metrics: `GET /api/admin/system-metrics`
- Deployment Status: `GET /api/admin/deployment-status`
