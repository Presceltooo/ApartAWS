# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build
RUN npm ci --omit=dev --legacy-peer-deps

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
# Security: use non-root node user
USER node

COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package*.json ./

EXPOSE 3004
CMD ["node", "dist/main"]
