# 🐳 Docker Complete Cheatsheet for Beginners

## 📦 Basic Docker Commands

### Images

```bash
# List images
docker images

# Pull image from Docker Hub
docker pull python:3.11

# Build image from Dockerfile
docker build -t myapp .

# Build with custom Dockerfile
docker build -f Dockerfile.prod -t myapp .

# Remove image
docker rmi myapp

# Remove all unused images
docker image prune -a

# Tag image
docker tag myapp myapp:v1.0

# Push to registry
docker push username/myapp:v1.0
```

### Containers

```bash
# Run container
docker run myapp

# Run with port mapping
docker run -p 8000:8000 myapp

# Run in background (detached)
docker run -d myapp

# Run with name
docker run --name my-container myapp

# Run interactively
docker run -it myapp bash

# Run with environment variables
docker run -e PORT=3000 -e DEBUG=true myapp

# Run with volume mount
docker run -v $(pwd):/app myapp

# Run and remove after exit
docker run --rm myapp

# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop container
docker stop my-container

# Start stopped container
docker start my-container

# Restart container
docker restart my-container

# Remove container
docker rm my-container

# Remove running container (force)
docker rm -f my-container

# Remove all stopped containers
docker container prune
```

### Logs & Debugging

```bash
# View logs
docker logs my-container

# Follow logs (live)
docker logs -f my-container

# Show last 100 lines
docker logs --tail 100 my-container

# Execute command in running container
docker exec -it my-container bash

# View container details
docker inspect my-container

# View container resource usage
docker stats

# View container processes
docker top my-container
```

### Cleanup

```bash
# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune -a

# Remove all unused volumes
docker volume prune

# Remove all unused networks
docker network prune

# Remove EVERYTHING unused
docker system prune -a

# View disk usage
docker system df
```

---

## 📝 Dockerfile Reference

### Basic Instructions

| Instruction  | Purpose                         | Example                    |
| ------------ | ------------------------------- | -------------------------- |
| `FROM`       | Base image                      | `FROM python:3.11-slim`    |
| `WORKDIR`    | Set working directory           | `WORKDIR /app`             |
| `COPY`       | Copy files                      | `COPY . .`                 |
| `ADD`        | Copy files (supports URLs, tar) | `ADD app.tar.gz /app`      |
| `RUN`        | Execute command                 | `RUN pip install flask`    |
| `ENV`        | Set environment variable        | `ENV PORT=8000`            |
| `ARG`        | Build-time variable             | `ARG VERSION=1.0`          |
| `EXPOSE`     | Document port                   | `EXPOSE 8000`              |
| `CMD`        | Default command                 | `CMD ["python", "app.py"]` |
| `ENTRYPOINT` | Fixed command                   | `ENTRYPOINT ["python"]`    |
| `VOLUME`     | Create mount point              | `VOLUME /data`             |
| `USER`       | Set user                        | `USER appuser`             |
| `LABEL`      | Add metadata                    | `LABEL version="1.0"`      |

---

## 📄 Dockerfile Examples

### Python (Single Stage)

```dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies first (caching)
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

EXPOSE 8000

CMD ["python", "app.py"]
```

### Python with Virtual Environment

```dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Create and activate virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "app.py"]
```

### Node.js (Single Stage)

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (caching)
COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### Go (Single Stage)

```dockerfile
FROM golang:1.21-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

EXPOSE 8080

CMD ["./main"]
```

---

## 🏗️ Multi-Stage Builds

### Why Multi-Stage?

- ✅ Smaller final image
- ✅ No build tools in production
- ✅ Better security
- ✅ Faster deployments

### Python Multi-Stage

```dockerfile
# ============ Build Stage ============
FROM python:3.11-slim AS builder

WORKDIR /app

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ============ Production Stage ============
FROM python:3.11-slim

WORKDIR /app

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Create non-root user
RUN useradd --create-home appuser
USER appuser

COPY --chown=appuser:appuser . .

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]
```

### Node.js Multi-Stage

```dockerfile
# ============ Build Stage ============
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ============ Production Stage ============
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

### Go Multi-Stage (Tiny Image!)

```dockerfile
# ============ Build Stage ============
FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# ============ Production Stage ============
FROM scratch

# Copy only the binary
COPY --from=builder /app/main /main

EXPOSE 8080

ENTRYPOINT ["/main"]
```

### React Multi-Stage (with Nginx)

```dockerfile
# ============ Build Stage ============
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ============ Production Stage ============
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## 🐙 Docker Compose

### Basic Commands

```bash
# Start services
docker compose up

# Start in background
docker compose up -d

# Build and start
docker compose up --build

# Stop services
docker compose down

# Stop and remove volumes
docker compose down -v

# View logs
docker compose logs

# Follow logs
docker compose logs -f

# View logs for specific service
docker compose logs app

# List running services
docker compose ps

# Execute command in service
docker compose exec app bash

# Restart services
docker compose restart

# Stop services (without removing)
docker compose stop

# Start stopped services
docker compose start

# Build images
docker compose build

# Pull images
docker compose pull
```

### Basic docker-compose.yml

```yaml
version: '3.8'

services:
    app:
        build: .
        ports:
            - '8000:8000'
        environment:
            - DEBUG=true
```

### Full Example (App + Database + Redis)

```yaml
version: '3.8'

services:
    # ============ Web Application ============
    app:
        build:
            context: .
            dockerfile: Dockerfile
        ports:
            - '8000:8000'
        environment:
            - DATABASE_URL=postgresql://user:password@db:5432/mydb
            - REDIS_URL=redis://redis:6379
        depends_on:
            - db
            - redis
        volumes:
            - .:/app # For development
        restart: unless-stopped

    # ============ PostgreSQL Database ============
    db:
        image: postgres:15-alpine
        environment:
            - POSTGRES_USER=user
            - POSTGRES_PASSWORD=password
            - POSTGRES_DB=mydb
        volumes:
            - postgres_data:/var/lib/postgresql/data
        ports:
            - '5432:5432'
        restart: unless-stopped

    # ============ Redis Cache ============
    redis:
        image: redis:7-alpine
        ports:
            - '6379:6379'
        volumes:
            - redis_data:/data
        restart: unless-stopped

# ============ Named Volumes ============
volumes:
    postgres_data:
    redis_data:
```

### With Environment File

```yaml
version: '3.8'

services:
    app:
        build: .
        ports:
            - '8000:8000'
        env_file:
            - .env
```

**.env file:**

```
DATABASE_URL=postgresql://user:pass@db:5432/mydb
SECRET_KEY=mysecretkey
DEBUG=false
```

### Multiple Compose Files

```bash
# Development
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```

**docker-compose.yml (base):**

```yaml
version: '3.8'

services:
    app:
        build: .
        environment:
            - DATABASE_URL=postgresql://user:pass@db:5432/mydb
```

**docker-compose.dev.yml:**

```yaml
version: '3.8'

services:
    app:
        volumes:
            - .:/app
        environment:
            - DEBUG=true
        ports:
            - '8000:8000'
```

**docker-compose.prod.yml:**

```yaml
version: '3.8'

services:
    app:
        environment:
            - DEBUG=false
        restart: always
```

### Health Checks

```yaml
version: '3.8'

services:
    app:
        build: .
        ports:
            - '8000:8000'
        healthcheck:
            test: ['CMD', 'curl', '-f', 'http://localhost:8000/health']
            interval: 30s
            timeout: 10s
            retries: 3
            start_period: 40s

    db:
        image: postgres:15-alpine
        healthcheck:
            test: ['CMD-SHELL', 'pg_isready -U user -d mydb']
            interval: 10s
            timeout: 5s
            retries: 5
```

---

## 🌐 Networking

### Network Commands

```bash
# List networks
docker network ls

# Create network
docker network create mynetwork

# Run container on network
docker run --network mynetwork myapp

# Connect container to network
docker network connect mynetwork my-container

# Disconnect from network
docker network disconnect mynetwork my-container

# Inspect network
docker network inspect mynetwork

# Remove network
docker network rm mynetwork
```

### Compose Networks

```yaml
version: '3.8'

services:
    frontend:
        build: ./frontend
        networks:
            - frontend-network

    backend:
        build: ./backend
        networks:
            - frontend-network
            - backend-network

    db:
        image: postgres:15
        networks:
            - backend-network

networks:
    frontend-network:
    backend-network:
```

---

## 💾 Volumes

### Volume Commands

```bash
# List volumes
docker volume ls

# Create volume
docker volume create myvolume

# Run with volume
docker run -v myvolume:/data myapp

# Bind mount (host directory)
docker run -v $(pwd)/data:/app/data myapp

# Read-only mount
docker run -v $(pwd)/config:/app/config:ro myapp

# Inspect volume
docker volume inspect myvolume

# Remove volume
docker volume rm myvolume

# Remove unused volumes
docker volume prune
```

### Volume Types

```yaml
version: '3.8'

services:
    app:
        build: .
        volumes:
            # Named volume
            - app_data:/app/data

            # Bind mount
            - ./src:/app/src

            # Read-only bind mount
            - ./config:/app/config:ro

volumes:
    app_data:
```

---

## 📁 .dockerignore

```
# Git
.git
.gitignore

# Python
__pycache__
*.pyc
*.pyo
venv/
.env

# Node
node_modules/
npm-debug.log

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Docker
Dockerfile*
docker-compose*

# Docs
README.md
docs/

# Tests
tests/
*.test.js
```

---

## 🔧 Best Practices

### Dockerfile

| ✅ Do                     | ❌ Don't                    |
| ------------------------- | --------------------------- |
| Use specific image tags   | Use `latest` tag            |
| Use `.dockerignore`       | Copy unnecessary files      |
| Order by change frequency | Random instruction order    |
| Combine RUN commands      | Multiple RUN for one task   |
| Use multi-stage builds    | Include build tools in prod |
| Run as non-root user      | Run as root                 |
| Use `COPY` over `ADD`     | Use `ADD` unless needed     |

### Layer Caching Order

```dockerfile
# 1. Base image (rarely changes)
FROM python:3.11-slim

# 2. System dependencies (rarely changes)
RUN apt-get update && apt-get install -y curl

# 3. App dependencies (sometimes changes)
COPY requirements.txt .
RUN pip install -r requirements.txt

# 4. Application code (frequently changes)
COPY . .

# 5. Runtime config
CMD ["python", "app.py"]
```

---

## 🚀 Quick Reference Card

### Most Used Commands

```bash
# Build
docker build -t myapp .

# Run
docker run -d -p 8000:8000 --name myapp myapp

# Logs
docker logs -f myapp

# Shell access
docker exec -it myapp bash

# Stop & Remove
docker stop myapp && docker rm myapp

# Compose up
docker compose up -d --build

# Compose down
docker compose down -v

# Cleanup
docker system prune -a
```

### Port Mapping

```
-p HOST:CONTAINER

-p 8000:8000     # localhost:8000 → container:8000
-p 3000:8000     # localhost:3000 → container:8000
-p 127.0.0.1:8000:8000  # Only localhost
```

### Environment Variables

```bash
# Single variable
docker run -e MY_VAR=value myapp

# Multiple variables
docker run -e VAR1=a -e VAR2=b myapp

# From file
docker run --env-file .env myapp
```

---

## 📊 Image Size Comparison

| Base Image           | Size   |
| -------------------- | ------ |
| `python:3.11`        | ~900MB |
| `python:3.11-slim`   | ~120MB |
| `python:3.11-alpine` | ~50MB  |
| `node:20`            | ~1GB   |
| `node:20-slim`       | ~200MB |
| `node:20-alpine`     | ~130MB |
| `golang:1.21`        | ~800MB |
| `golang:1.21-alpine` | ~250MB |
| `scratch`            | 0MB    |

---

Happy Dockerizing! 🐳
