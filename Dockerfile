# Multi-stage build für optimale Größe und Performance
FROM node:20-alpine AS builder

# Arbeitsverzeichnis erstellen
WORKDIR /app

# Package files kopieren und alle dependencies installieren (inkl. devDependencies für build)
COPY package*.json ./
RUN npm ci

# Source code kopieren und build erstellen
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# curl für Healthcheck installieren
RUN apk add --no-cache curl

# Non-root user erstellen für Sicherheit
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Nur production dependencies installieren
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Built assets vom builder stage kopieren
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Ownership ändern für non-root user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Port von Cloud Run verwenden (standardmäßig 8080)
ENV PORT=8080
ENV VITE_HOST=0.0.0.0
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true
EXPOSE $PORT

# Gesundheitscheck für Cloud Run
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/ || exit 1

# Vite preview starten für production mit dynamischem Port und explicit host configuration
CMD ["sh", "-c", "npm run preview -- --host 0.0.0.0 --port $PORT --strictPort"]