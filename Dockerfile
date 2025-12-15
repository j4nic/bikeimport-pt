# Multi-stage build für optimale Größe und Performance
FROM node:20-alpine AS builder

# Arbeitsverzeichnis erstellen
WORKDIR /app

# Package files kopieren und dependencies installieren
COPY package*.json ./
RUN npm ci --only=production

# Source code kopieren und build erstellen
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

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

# Port exposing (Cloud Run erwartet dies)
EXPOSE 3030

# Gesundheitscheck für Cloud Run
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3030/ || exit 1

# Vite preview starten für production
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3030"]