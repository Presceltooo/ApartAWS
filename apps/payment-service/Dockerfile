# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --legacy-peer-deps
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
USER node

COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/prisma.config.ts ./

EXPOSE 3005
CMD ["node", "dist/main"]
