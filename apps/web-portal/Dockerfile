# Giai đoạn 1: Build React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Giai đoạn 2: Serve bằng Nginx
FROM nginx:stable-alpine
# Copy cấu hình proxy và SPA routing cho Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy file đã build từ Vite (mặc định là thư mục dist) vào thư mục của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]