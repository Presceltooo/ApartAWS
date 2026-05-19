# 🎓 Khung Nội dung Thuyết trình Bảo vệ Khóa luận — 20 Slide / 10 phút

> **Đề tài:** Xây dựng hệ thống Đặt phòng và Quản lý căn hộ triển khai trên nền tảng Cloud-Native AWS  
> **Hội đồng:** Web / Mobile / Microservices / Cloud / Blockchain  
> **Thời lượng:** 10 phút → ~30 giây/slide

---

## ⏱️ Phân bổ thời gian (10 phút)

| Phần | Slides | Thời gian |
|------|--------|-----------|
| Mở đầu & Giới thiệu vấn đề | 1–3 | ~1.5 phút |
| Phân tích & Thiết kế hệ thống | 4–8 | ~2.5 phút |
| Công nghệ & Triển khai Cloud | 9–13 | ~2.5 phút |
| Demo & Kết quả thực tế | 14–17 | ~2 phút |
| Kết luận & Hỏi đáp | 18–20 | ~1.5 phút |

---

## 📋 NỘI DUNG CHI TIẾT TỪNG SLIDE

---

### SLIDE 1 — TRANG BÌA (Tiêu đề)

**Tiêu đề chính:**
> Xây dựng hệ thống Đặt phòng và Quản lý Căn hộ  
> triển khai trên nền tảng Cloud-Native AWS

**Thông tin:**
- Sinh viên: [Họ tên]
- MSSV: [MSSV]
- Giảng viên hướng dẫn: [Tên GVHD]
- Khoa: Khoa học & Kỹ thuật Máy tính
- Ngày bảo vệ: [Ngày]

**Gợi ý thiết kế:** Nền tối (dark mode), logo trường, icon AWS + cloud

---

### SLIDE 2 — ĐẶT VẤN ĐỀ / MOTIVATION

**Tiêu đề:** Tại sao cần hệ thống này?

**Nội dung:**
- 🏙️ Thị trường cho thuê căn hộ ngắn hạn tại Việt Nam tăng trưởng mạnh (Airbnb, Booking.com…)
- 😤 **Vấn đề hiện tại:**
  - Chủ nhà quản lý lịch đặt thủ công → dễ trùng lịch, nhầm lẫn
  - Khách thuê khó tìm căn hộ phù hợp, thiếu minh bạch thông tin
  - Thiếu nền tảng Việt Nam kết nối trực tiếp chủ nhà – khách thuê
- 🎯 **Mục tiêu:** Xây dựng nền tảng số hoàn chỉnh, scale được, triển khai trên Cloud

**Gợi ý:** Dùng 2–3 icon minh họa vấn đề, không cần text quá dài

---

### SLIDE 3 — MỤC TIÊU & PHẠM VI ĐỀ TÀI

**Tiêu đề:** Mục tiêu đề tài

**3 mục tiêu chính:**
1. 🏗️ **Xây dựng hệ thống** đặt phòng + quản lý căn hộ đa vai trò (Tenant / Owner / Admin)
2. ☁️ **Triển khai Cloud-Native** trên AWS: EC2, ECR, S3, Route 53
3. ⚙️ **Áp dụng Microservices** + CI/CD tự động với GitHub Actions

**Phạm vi:**
- ✅ Web Application (SPA – React + Vite)
- ✅ 3 Microservices: Auth, Apartment, Booking
- ✅ API Gateway pattern
- ✅ CI/CD Pipeline: GitHub → ECR → EC2

---

### SLIDE 4 — PHÂN TÍCH NGHIỆP VỤ & CÁC TÁC NHÂN

**Tiêu đề:** Phân tích nghiệp vụ

**Use Case tổng quan — 3 Role:**

| Vai trò | Chức năng chính |
|---------|----------------|
| 🧑‍💼 **Tenant** (Khách thuê) | Xem listing, Đặt phòng, Xem lịch sử, Hủy booking |
| 🏠 **Owner** (Chủ nhà) | Đăng căn hộ, Quản lý booking, Xác nhận/Từ chối |
| 👨‍💻 **Admin** (Quản trị) | Quản lý User, Apartment, Booking toàn hệ thống |

**Gợi ý:** Vẽ Use Case Diagram đơn giản hoặc dùng bảng như trên

---

### SLIDE 5 — LUỒNG NGHIỆP VỤ CỐT LÕI

**Tiêu đề:** Luồng đặt phòng E2E (End-to-End)

**State Machine / Flow:**

```
Tenant xem listing
    → Chọn căn hộ + chọn ngày
    → Tạo booking [PENDING]
        → Owner xác nhận → [CONFIRMED]
        → Owner từ chối → [CANCELLED]
    → Hết ngày → [COMPLETED]
    → Tenant hoặc Owner hủy → [CANCELLED]
```

**Trạng thái Booking:** `PENDING` → `CONFIRMED` → `COMPLETED` / `CANCELLED`

**Gợi ý:** Vẽ State Diagram (như file business_flow_analysis.md của bạn)

---

### SLIDE 6 — KIẾN TRÚC TỔNG THỂ HỆ THỐNG

**Tiêu đề:** Kiến trúc Microservices

**4 tầng kiến trúc:**

```
[Web Portal - React/Vite :5174]
        ↓ HTTP
[API Gateway - NestJS :3000]
   ↙        ↓         ↘
[Auth    [Apartment  [Booking
 :3001]   :3002]      :3003]
        ↘  ↓   ↙
    [PostgreSQL - 3 Schema]
    [AWS S3 - Image Storage]
```

**Điểm nhấn:**
- API Gateway đóng vai trò **Single Entry Point**
- JWT Auth Middleware: verify token → forward `x-user-id` header
- Mỗi service có **Database Schema riêng** (auth / apartment / booking)
- Booking Service gọi Apartment Service qua **Inter-service HTTP**

---

### SLIDE 7 — THIẾT KẾ DATABASE

**Tiêu đề:** Thiết kế cơ sở dữ liệu

**3 Schema độc lập (PostgreSQL):**

**Schema `auth`:**
- `User` (id, email, password, fullName, role, refreshToken…)

**Schema `apartment`:**
- `Apartment` (id, ownerId, title, description, location, pricePerNight, imageUrls[], isActive…)

**Schema `booking`:**
- `Booking` (id, apartmentId, tenantId, startDate, endDate, totalPrice, status, cancelReason…)

**Gợi ý:** ERD diagram đơn giản với 3 entity chính

---

### SLIDE 8 — THIẾT KẾ API (RESTful)

**Tiêu đề:** Thiết kế API Gateway & Microservices

**Bảng API endpoints chính:**

| Method | Endpoint | Service | Mô tả |
|--------|----------|---------|-------|
| `POST` | `/Auth/register` | Auth | Đăng ký tài khoản |
| `POST` | `/Auth/login` | Auth | Đăng nhập → JWT |
| `GET` | `/Apartments/listing` | Apartment | Xem danh sách căn hộ |
| `POST` | `/Apartments` | Apartment | Tạo căn hộ mới (Owner) |
| `POST` | `/Bookings` | Booking | Tạo đơn đặt phòng |
| `PATCH` | `/Bookings/:id/confirm` | Booking | Owner xác nhận |
| `PATCH` | `/Bookings/:id/cancel` | Booking | Hủy booking |

**Công nghệ:** NestJS + Swagger UI (API documentation tự sinh)

---

### SLIDE 9 — CÔNG NGHỆ SỬ DỤNG

**Tiêu đề:** Technology Stack

**Bảng công nghệ:**

| Layer | Technology | Lý do chọn |
|-------|-----------|------------|
| **Frontend** | React 18 + Vite + TypeScript | SPA nhanh, type-safe, HMR |
| **Routing** | TanStack Router | Type-safe routing |
| **UI** | Ant Design | Đầy đủ component, production-ready |
| **Backend** | NestJS (Node.js) | Decorator, DI, Module pattern |
| **ORM** | Prisma | Type-safe DB access, migration |
| **Database** | PostgreSQL 15 | ACID, JSON support |
| **Container** | Docker + Docker Compose | Isolation, reproducible |
| **Cloud** | AWS (EC2, ECR, S3) | Scalable, managed |
| **CI/CD** | GitHub Actions | Tự động hóa build & deploy |

---

### SLIDE 10 — TRIỂN KHAI CLOUD-NATIVE AWS

**Tiêu đề:** Kiến trúc Cloud trên AWS

**AWS Services được sử dụng:**

```
GitHub (Source Code)
    ↓ Push to main branch
GitHub Actions (CI/CD Pipeline)
    ↓ docker build
Amazon ECR (Docker Registry)
    ├── auth-service:latest
    ├── apartment-service:latest
    ├── booking-service:latest
    ├── api-gateway:latest
    └── web-portal:latest
    ↓ docker pull
Amazon EC2 (Runtime Host)
    └── Docker Compose (Production)
Amazon S3
    └── Lưu trữ ảnh căn hộ (Presigned URL)
```

**Gợi ý:** Vẽ AWS Architecture Diagram với các icon AWS chính thức

---

### SLIDE 11 — CI/CD PIPELINE

**Tiêu đề:** Tự động hóa CI/CD với GitHub Actions

**Pipeline Flow:**

```
Developer push code
    → main branch trigger
    → GitHub Actions chạy
        → Checkout code
        → AWS Credentials (Secrets)
        → Login Amazon ECR
        → docker build (5 services song song - matrix strategy)
        → docker push → ECR Registry
        → [Deploy to EC2 via SSH] (đã viết sẵn)
```

**Matrix Strategy:** Build 5 service song song → giảm thời gian CI/CD

**Gợi ý:** Screenshot GitHub Actions workflow run thực tế

---

### SLIDE 12 — BẢO MẬT HỆ THỐNG

**Tiêu đề:** Security & Authentication

**Cơ chế bảo mật:**

1. **JWT Access Token** (15 phút) + **Refresh Token** (7 ngày)
   - Refresh Token Rotation: mỗi lần refresh → token mới → revoke token cũ
   
2. **API Gateway Middleware:**
   - Verify JWT → extract `userId` → forward `x-user-id` header
   - Downstream services KHÔNG cần verify JWT trực tiếp
   
3. **Authorization:**
   - Role-based: `TENANT` / `OWNER` / `ADMIN`
   - Resource-level: Owner chỉ sửa/xóa căn hộ của chính mình
   
4. **AWS S3 Presigned URL:**
   - Upload ảnh trực tiếp lên S3 (không qua server)
   - URL có thời hạn → an toàn

---

### SLIDE 13 — CONTAINERIZATION & DEPLOYMENT

**Tiêu đề:** Docker & Containerization

**2 môi trường:**

| | Dev (docker-compose.yml) | Prod (docker-compose.prod.yml) |
|--|--------------------------|-------------------------------|
| **Image** | `node:20-alpine` + volume mount | Pull từ Amazon ECR |
| **Hot Reload** | ✅ HMR qua volumes | ❌ Static build |
| **Health Check** | ❌ | ✅ PostgreSQL healthcheck |
| **Restart** | ❌ | ✅ `unless-stopped` |
| **Secrets** | `.env` file | `.env` + AWS Secrets |

**Nginx:** Phục vụ React SPA build tĩnh (port 80), reverse proxy

---

### SLIDE 14 — DEMO — GIAO DIỆN NGƯỜI DÙNG (Tenant Flow)

**Tiêu đề:** Demo — Luồng Khách thuê

**Screenshot cần chuẩn bị:**

1. 🏠 **Homepage** — Listing căn hộ, search, filter theo giá/địa điểm
2. 🔍 **Apartment Detail** — Ảnh, mô tả, giá, bản đồ, nút "Đặt phòng"
3. 📅 **Booking Modal** — Chọn ngày check-in/out, tính tổng tiền tự động
4. 📋 **My Bookings** — Danh sách booking với trạng thái badge (PENDING/CONFIRMED…)

**Script demo (30 giây):**
> "Khách đăng nhập → tìm căn hộ → xem chi tiết → đặt phòng → theo dõi trạng thái"

---

### SLIDE 15 — DEMO — GIAO DIỆN OWNER

**Tiêu đề:** Demo — Luồng Chủ nhà

**Screenshot cần chuẩn bị:**

1. 📊 **Owner Dashboard** — Thống kê tổng quan
2. ➕ **Tạo/Sửa Căn hộ** — Form với upload ảnh lên AWS S3
3. ✅ **Quản lý Booking** — Danh sách, nút Xác nhận / Từ chối / Hoàn thành
4. 📸 **Upload ảnh** — S3 Presigned URL upload trực tiếp

**Điểm nhấn kỹ thuật:**
> "Ảnh được upload thẳng lên S3 qua Presigned URL, server không phải xử lý binary data"

---

### SLIDE 16 — DEMO — ADMIN PANEL

**Tiêu đề:** Demo — Quản trị hệ thống

**Tính năng Admin:**
- 👥 **System Users** — Danh sách toàn bộ user
- 🏢 **System Apartments** — Phê duyệt (Active/Inactive) căn hộ
- 📋 **System Bookings** — Xem + can thiệp tất cả booking
- 📊 **Dashboard Stats** — Tổng users, apartments, bookings, revenue

---

### SLIDE 17 — KẾT QUẢ THỰC HIỆN

**Tiêu đề:** Kết quả đạt được

**Bảng tổng kết:**

| Hạng mục | Kết quả |
|----------|---------|
| **Số tính năng hoàn thành** | ~15+ tính năng core |
| **Microservices** | 4 service (Auth + Apartment + Booking + Gateway) |
| **API Endpoints** | 25+ REST API endpoints với Swagger docs |
| **Frontend Pages** | Portal (Tenant) + Admin (Owner/Admin) |
| **AWS Services** | EC2, ECR, S3, (Route 53) |
| **CI/CD** | GitHub Actions → ECR (tự động khi push main) |
| **Database** | PostgreSQL 3 schema độc lập |

**Luồng E2E hoàn chỉnh:**
> ✅ Đăng ký → Đăng nhập → Xem căn hộ → Đặt phòng → Owner xác nhận → Hoàn thành / Hủy

---

### SLIDE 18 — HẠN CHẾ & HƯỚNG PHÁT TRIỂN

**Tiêu đề:** Hạn chế & Hướng phát triển

**Hạn chế hiện tại:**
- ⚠️ Chưa tích hợp thanh toán thực (VNPay / Stripe)
- ⚠️ Chưa có hệ thống Review/Rating thực
- ⚠️ CloudWatch monitoring chưa setup
- ⚠️ Chưa dùng RDS (Amazon Managed PostgreSQL)

**Hướng phát triển:**

| Ngắn hạn | Dài hạn |
|----------|---------|
| ✅ Tích hợp VNPay / Stripe sandbox | 📱 Mobile App (React Native) |
| ✅ Review & Rating system | 🔔 Push Notification (SNS/FCM) |
| ✅ Amazon RDS | 🗺️ Map integration (Google Maps) |
| ✅ CloudWatch Logging | 🤖 AI gợi ý căn hộ |
| ✅ AWS ALB + Auto Scaling | 🌐 CDN CloudFront |

---

### SLIDE 19 — KẾT LUẬN

**Tiêu đề:** Kết luận

**Tóm tắt đóng góp:**

1. 🏗️ **Kiến trúc:** Thiết kế và triển khai thành công hệ thống Microservices với API Gateway pattern trên AWS Cloud

2. 🔧 **Kỹ thuật:** Áp dụng NestJS + Prisma + PostgreSQL đa schema, JWT auth với Refresh Token Rotation

3. ☁️ **Cloud-Native:** Containerize toàn bộ hệ thống với Docker, CI/CD pipeline tự động GitHub Actions → ECR → EC2

4. 🎨 **UX:** Giao diện React SPA hoàn chỉnh 3 role (Tenant / Owner / Admin) với Ant Design

**Câu kết:**
> "Đề tài đã xây dựng thành công nền tảng cho thuê căn hộ hoàn chỉnh, ứng dụng các công nghệ Cloud-Native hiện đại, sẵn sàng cho môi trường production."

---

### SLIDE 20 — CẢM ƠN & HỎI ĐÁP

**Tiêu đề:** Cảm ơn Hội đồng!

**Nội dung:**
- Lời cảm ơn Giảng viên hướng dẫn, Hội đồng chấm
- QR Code / Link GitHub repo (nếu public)
- QR Code / Link Demo URL (nếu deploy lên EC2)

**Chuẩn bị Q&A:**  
*(Xem phần gợi ý câu hỏi bên dưới)*

---

## ❓ GỢI Ý CÂU HỎI HỘI ĐỒNG CÓ THỂ HỎI

### Về Microservices
- **Tại sao dùng Microservices thay vì Monolith cho bài này?**  
  → Scale độc lập từng service (Booking nhiều traffic hơn Auth), fault isolation, deploy độc lập

- **Communication giữa các service như thế nào?**  
  → HTTP synchronous (Booking → Apartment để lấy giá). Có thể cải tiến với Message Queue (RabbitMQ/Kafka) cho async

- **Nếu Apartment Service down thì Booking Service xử lý sao?**  
  → Hiện tại fail nhanh (throw exception). Cải tiến: Circuit Breaker pattern

### Về Cloud / AWS
- **Cloud-Native có nghĩa gì?**  
  → Thiết kế từ đầu cho cloud: containerized, stateless, auto-scale, CI/CD tự động

- **Tại sao dùng ECR thay vì Docker Hub?**  
  → Tích hợp IAM AWS sẵn, private registry, latency thấp hơn khi pull trên EC2

- **Presigned URL là gì, sao không upload qua server?**  
  → Client upload thẳng lên S3, giảm tải server, tăng tốc độ, giảm băng thông

### Về Database
- **Tại sao 3 schema trong 1 DB thay vì 3 DB riêng?**  
  → Trade-off: 1 DB đơn giản hơn cho môi trường học thuật. Production nên tách DB riêng

- **Xử lý conflict booking (2 user đặt cùng lúc) như thế nào?**  
  → `checkAvailability()` kiểm tra trước khi tạo. Cải tiến: Transaction + SELECT FOR UPDATE / Optimistic Locking

### Về Security
- **Refresh Token Rotation là gì?**  
  → Mỗi lần dùng Refresh Token → nhận token mới → token cũ bị revoke → chống replay attack

- **Làm sao ngăn chặn Tenant giả mạo userId?**  
  → Gateway verify JWT, extract userId từ token và forward qua header x-user-id. Service chỉ tin header từ Gateway

---

## 📝 CHECKLIST CHUẨN BỊ

- [ ] Thiết kế slide (PowerPoint / Google Slides / Canva)
- [ ] Vẽ Architecture Diagram (draw.io / Excalidraw)
- [ ] Vẽ ERD Database
- [ ] Screenshot/Record demo thực tế
- [ ] Chuẩn bị demo live (nếu có internet + server đang chạy)
- [ ] Luyện nói đủ 10 phút (không nhanh quá, không chậm quá)
- [ ] Chuẩn bị Q&A answers

---

> [!TIP]
> **Lời khuyên cho 10 phút thuyết trình:**  
> Dành 70% thời gian cho **Kiến trúc (slide 6-11)** và **Demo (slide 14-16)** — đây là phần hội đồng quan tâm nhất.  
> Slide 1-3 nên nói nhanh (< 1.5 phút), đừng đọc hết text trên slide.
