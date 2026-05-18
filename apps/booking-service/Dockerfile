# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
# Cài đặt thư viện cần cho Prisma trên Alpine
RUN apk add --no-cache openssl

COPY package*.json ./
# Booking-service có thể dùng --legacy-peer-deps như trong docker-compose
# Copy folder prisma trước để generate client
COPY prisma ./prisma/ 
RUN npm install --legacy-peer-deps
# Quan trọng: Sinh ra Prisma Client
RUN npx prisma generate

COPY . .
RUN npm run build
RUN cp -R node_modules/@prisma node_modules/.prisma /tmp/ && \
    npm ci --omit=dev --legacy-peer-deps && \
    rm -rf node_modules/@prisma node_modules/.prisma && \
    cp -R /tmp/@prisma node_modules/ && \
    cp -R /tmp/.prisma node_modules/

# Stage 2: Production
FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app
# Bảo mật: Dùng user node thay vì root
USER node

COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/prisma.config.ts ./

EXPOSE 3003
CMD ["node", "dist/main"]
