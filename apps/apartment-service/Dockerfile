# Giai đoạn 1: Build (Cài đặt và biên dịch code TypeScript)
FROM node:20-alpine AS builder
WORKDIR /app

# Copy file cấu hình package trước để tối ưu cache của Docker
COPY package*.json ./
RUN npm install

# Copy toàn bộ code và build ra file JS
COPY . .
RUN npm run build

# Giai đoạn 2: Production (Chỉ lấy những thứ cần để chạy)
FROM node:20-alpine
WORKDIR /app

# Chỉ copy node_modules và thư mục dist (code đã build) từ stage builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["node", "dist/main"]