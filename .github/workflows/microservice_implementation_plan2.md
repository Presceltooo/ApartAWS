# 🏗️ Kế Hoạch Triển Khai Microservice — APARTAWS

> **Mục tiêu**: Chuyển đổi kiến trúc monolith hiện tại sang microservice, triển khai trên AWS.

---

## 📊 Phân Tích Kiến Trúc Hiện Tại

### Cấu trúc Monolith hiện tại

```mermaid
graph TB
    subgraph "Hiện tại — Monolith"
        FE["🖥️ web-portal<br/>(React + Vite + Ant Design)"]
        BE["⚙️ apartment-service<br/>(NestJS Monolith)"]
        DB[("🗄️ PostgreSQL<br/>apart_booking")]
        
        FE -->|"HTTP REST"| BE
        BE -->|"Prisma ORM"| DB
    end

    subgraph "Backend Modules (cùng 1 process)"
        AUTH["🔐 AuthModule"]
        APT["🏠 ApartmentModule"]
        BK["📅 BookingModule"]
        NTF["🔔 NotificationModule<br/>(trống)"]
        COMMON["📦 Common<br/>(Prisma, DTO, Decorators)"]
    end

    BE --- AUTH
    BE --- APT
    BE --- BK
    BE --- NTF
    BE --- COMMON
```

### Thống kê hiện tại

| Thành phần | Công nghệ | Files | Ghi chú |
|---|---|---|---|
| **Frontend** | React 19, Vite 7, TypeScript, Ant Design 6, TanStack Router/Query | ~20+ | SPA with auth flow |
| **Backend** | NestJS 11, Prisma 7, PostgreSQL 15, PassportJWT | ~25+ | Monolith, 4 modules |
| **Database** | PostgreSQL 15 | 4 tables | Users, Apartments, Bookings, RefreshTokens |
| **DevOps** | Docker, docker-compose | 2 Dockerfiles | Dev mode + Production multi-stage |

### Các API endpoints hiện tại

| Module | Endpoint | Method | Mô tả |
|---|---|---|---|
| **Auth** | `/api/Auth/register` | POST | Đăng ký |
| **Auth** | `/api/Auth/login` | POST | Đăng nhập |
| **Auth** | `/api/Auth/refresh` | POST | Refresh token (rotation) |
| **Auth** | `/api/Auth/logout` | POST | Đăng xuất |
| **Auth** | `/api/Auth/verify` | POST | Verify token (cho Gateway) |
| **Auth** | `/api/Auth/me` | GET | Thông tin user |
| **Auth** | `/api/Auth/change-password` | PATCH | Đổi mật khẩu |
| **Apartment** | `/api/Apartments` | GET/POST | CRUD căn hộ |
| **Apartment** | `/api/Apartments/listing` | GET | Public listing |
| **Apartment** | `/api/Apartments/:id` | GET/PUT/DELETE | Chi tiết/sửa/xóa |
| **Booking** | `/api/Bookings` | POST | Đặt phòng |
| **Booking** | `/api/Bookings/my-bookings` | GET | Lịch sử đặt phòng |
| **Booking** | `/api/Bookings/owner` | GET | Booking của chủ nhà |
| **Booking** | `/api/Bookings/check-availability` | GET | Kiểm tra lịch trống |
| **Booking** | `/api/Bookings/:id` | GET | Chi tiết booking |
| **Booking** | `/api/Bookings/:id/cancel` | PATCH | Hủy booking |

---

## 🎯 Kiến Trúc Microservice Đề Xuất

```mermaid
graph TB
    CLIENT["🖥️ Web Portal<br/>(React SPA)"]
    CDN["☁️ CloudFront CDN<br/>+ S3 Static Hosting"]
    GW["🚪 API Gateway<br/>(NestJS)"]
    
    AUTH["🔐 Auth Service<br/>Port: 3001"]
    APT["🏠 Apartment Service<br/>Port: 3002"]
    BK["📅 Booking Service<br/>Port: 3003"]
    NTF["🔔 Notification Service<br/>Port: 3004"]
    
    subgraph "🗄️ DB: apart_booking"
        DB_AUTH[("Schema: auth")]
        DB_APT[("Schema: apartment")]
        DB_BK[("Schema: booking")]
    end
    
    MQ["📨 Message Queue<br/>(SQS / RabbitMQ)"]
    CACHE["⚡ Redis<br/>Session Cache"]
    
    CLIENT --> CDN
    CLIENT -->|"HTTPS"| GW
    
    GW -->|"/api/auth/*"| AUTH
    GW -->|"/api/apartments/*"| APT
    GW -->|"/api/bookings/*"| BK
    
    AUTH --> DB_AUTH
    AUTH --> CACHE
    APT --> DB_APT
    BK --> DB_BK
    
    BK -->|"Booking Created"| MQ
    AUTH -->|"User Registered"| MQ
    MQ --> NTF
    
    style GW fill:#f9a825,stroke:#f57f17,color:#000
    style AUTH fill:#66bb6a,stroke:#2e7d32,color:#000
    style APT fill:#42a5f5,stroke:#1565c0,color:#000
    style BK fill:#ab47bc,stroke:#6a1b9a,color:#fff
    style NTF fill:#ef5350,stroke:#c62828,color:#fff
```

### Nguyên tắc tách service

| Nguyên tắc | Giải thích |
|---|---|
| **Single Responsibility** | Mỗi service chịu trách nhiệm 1 domain duy nhất |
| **Database per Service (Logical)** | Dùng chung 1 DB vật lý nhưng mỗi service dùng 1 schema riêng |
| **API Gateway Pattern** | Một điểm vào duy nhất, xác thực tập trung |
| **Event-Driven** | Giao tiếp giữa services qua message queue (loose coupling) |
| **Shared Nothing** | Không share code giữa các service (duplicate is OK) |

---

## 📁 Cấu Trúc Thư Mục Đề Xuất

```
APARTAWS/
├── apps/
│   ├── api-gateway/          # 🚪 API Gateway (NestJS)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── proxy/        # Route proxy tới các service
│   │   │   ├── auth/         # Auth middleware (verify token)
│   │   │   └── config/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── auth-service/         # 🔐 Auth Service
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── auth/         # Register, Login, Refresh, Verify
│   │   │   ├── user/         # User profile, change password
│   │   │   └── common/       # Prisma, DTO, Utils
│   │   ├── prisma/
│   │   │   └── schema.prisma # Chỉ có User + RefreshToken
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── apartment-service/    # 🏠 Apartment Service
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── apartment/    # CRUD Apartment
│   │   │   └── common/
│   │   ├── prisma/
│   │   │   └── schema.prisma # Chỉ có Apartment
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── booking-service/      # 📅 Booking Service
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── booking/      # CRUD Booking
│   │   │   └── common/
│   │   ├── prisma/
│   │   │   └── schema.prisma # Chỉ có Booking (+ ref apartmentId)
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── notification-service/ # 🔔 Notification Service
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── email/
│   │   │   ├── sms/
│   │   │   └── queue/        # Message consumer
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── web-portal/           # 🖥️ Frontend (giữ nguyên)
│       └── ...
│
├── docker-compose.yml        # Orchestration tất cả services
├── docker-compose.dev.yml    # Dev override
└── .github/
    └── workflows/
        ├── auth-service.yml
        ├── apartment-service.yml
        ├── booking-service.yml
        └── web-portal.yml
```

---

## 📋 Kế Hoạch Triển Khai Theo Phase

---

### Phase 0: Chuẩn Bị & Học Tập *(1-2 ngày)*

> [!IMPORTANT]
> Phase này giúp bạn hiểu rõ các khái niệm trước khi bắt tay code.

#### Checklist

- [ ] **Hiểu các pattern cốt lõi:**
  - API Gateway Pattern
  - Database-per-Service Pattern
  - Event-Driven Architecture
  - Service Discovery
- [ ] **Công cụ cần chuẩn bị:**
  - Docker Desktop đã cài ✅ (bạn đã có)
  - AWS CLI + AWS Account (Free Tier)
  - Postman / Thunder Client cho API testing
- [ ] **Đọc hiểu:**
  - [NestJS Microservices docs](https://docs.nestjs.com/microservices/basics)
  - `@nestjs/microservices` package
  - HTTP Proxy vs gRPC vs Message patterns

---

### Phase 1: API Gateway + Tách Schema *(3-5 ngày)*

> [!NOTE]
> Đây là bước quan trọng nhất — tạo "cửa ngõ" duy nhất cho mọi request. Frontend sẽ **chỉ giao tiếp với Gateway**.

#### 1.1 — Tạo API Gateway Service

```
Task: Khởi tạo NestJS project mới cho API Gateway
```

```bash
# Tạo project
cd apps
npx -y @nestjs/cli@latest new api-gateway --skip-git --package-manager npm
```

**Chức năng chính của Gateway:**
1. Nhận mọi request từ Frontend
2. Gọi Auth Service để verify JWT token
3. Inject header `x-user-id` + `x-user-role` vào request
4. Forward request tới service đích (HTTP proxy)

**Code mẫu — Gateway Proxy Module:**

```typescript
// apps/api-gateway/src/proxy/proxy.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyController } from './proxy.controller';
import { AuthMiddleware } from '../auth/auth.middleware';

@Module({
  imports: [HttpModule],
  controllers: [ProxyController],
})
export class ProxyModule {
  configure(consumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('/api/auth/login', '/api/auth/register') // Public routes
      .forRoutes('*');
  }
}
```

```typescript
// apps/api-gateway/src/auth/auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private httpService: HttpService) {}

  async use(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException('Missing token');

    try {
      // Gọi Auth Service để verify
      const { data } = await firstValueFrom(
        this.httpService.post(`${process.env.AUTH_SERVICE_URL}/api/Auth/verify`, { token })
      );
      
      // Inject user info vào headers
      req.headers['x-user-id'] = data.data.userId;
      req.headers['x-user-role'] = data.data.role;
      next();
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
```

#### 1.2 — Tách Schema trong cùng 1 Database
Từ **1 schema** `public` chung trong DB `apart_booking` → **3 schemas** riêng biệt:

```mermaid
graph LR
    subgraph "Database: apart_booking"
        subgraph "Hiện tại"
            SCH_PUB[("Schema: public<br/>• Users<br/>• RefreshTokens<br/>• Apartments<br/>• Bookings")]
        end
        
        subgraph "Sau khi tách"
            SCH_AUTH[("Schema: auth<br/>• Users<br/>• RefreshTokens")]
            SCH_APT[("Schema: apartment<br/>• Apartments")]
            SCH_BK[("Schema: booking<br/>• Bookings")]
        end
        
        SCH_PUB -->|migrate| SCH_AUTH
        SCH_PUB -->|migrate| SCH_APT
        SCH_PUB -->|migrate| SCH_BK
    end
```

**Prisma schema cho Auth Service:**
```prisma
// apps/auth-service/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // chứa ?schema=auth
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  phone     String?  @unique
  address   String?
  fullName  String?
  role      Role     @default(TENANT)
  createdAt DateTime @default(now())
  refreshTokens RefreshToken[]
  @@map("Users")
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  isRevoked Boolean  @default(false)
  createdAt DateTime @default(now())
  @@map("RefreshTokens")
}

enum Role { ADMIN OWNER TENANT }
```

**Prisma schema cho Apartment Service:**
```prisma
// apps/apartment-service/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // chứa ?schema=apartment
}

model Apartment {
  id            String    @id @default(uuid())
  title         String    @db.VarChar(255)
  description   String?   @db.Text
  pricePerNight Decimal   @db.Decimal(10, 2)
  location      String
  amenities     String[]
  images        String[]
  isActive      Boolean   @default(true)
  ownerId       String?   // FK chỉ lưu ID, KHÔNG có relation
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  @@map("Apartments")
}
```

> [!WARNING]
> Khi tách schema, bạn không nên sử dụng trực tiếp Foreign Key xuyên schema trong Prisma để tách bạch Domain hoàn toàn. Quan hệ như `Booking.tenantId → User.id` sẽ lưu ID dạng tham chiếu string và validate bằng lệnh gọi API.

#### 1.3 — Tiêu chí hoàn thành Phase 1

- [ ] API Gateway chạy được, forward request đúng tới backend hiện tại
- [ ] Frontend đổi `VITE_API_URL` trỏ vào Gateway (thay vì trực tiếp backend)
- [ ] Tất cả API cũ vẫn hoạt động thông qua Gateway
- [ ] 3 schema riêng trong cùng 1 database đã được thiết kế (chưa cần migrate data)

---

### Phase 2: Tách Auth Service *(3-4 ngày)*

> [!TIP]
> Auth Service nên tách **đầu tiên** vì nó ít phụ thuộc vào module khác nhất, và Gateway cần nó để verify token.

#### 2.1 — Tạo Auth Service Project

```bash
cd apps
npx -y @nestjs/cli@latest new auth-service --skip-git --package-manager npm
```

#### 2.2 — Di chuyển code

| Từ (Monolith) | Đến (Auth Service) |
|---|---|
| `src/modules/auth/` | `src/auth/` |
| `src/common/prisma/` | `src/common/prisma/` (copy) |
| `src/common/dto/response.dto.ts` | `src/common/dto/response.dto.ts` (copy) |
| `prisma/schema.prisma` (User + RefreshToken) | `prisma/schema.prisma` |

#### 2.3 — Config riêng cho Auth Service

```env
# apps/auth-service/.env.development
DATABASE_URL="postgresql://user:password@localhost:5432/apart_booking?schema=auth"
PORT=3001
NODE_ENV=development
JWT_SECRET=your-dev-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-dev-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
```

#### 2.4 — Cập nhật Gateway routing

```typescript
// Gateway: route /api/auth/* → Auth Service
@Controller('api/auth')
export class AuthProxyController {
  constructor(private httpService: HttpService) {}

  @All('*')
  async proxy(@Req() req, @Res() res) {
    const url = `${process.env.AUTH_SERVICE_URL}${req.url}`;
    const response = await firstValueFrom(
      this.httpService.request({
        url,
        method: req.method,
        data: req.body,
        headers: { ...req.headers, host: undefined },
      })
    );
    res.status(response.status).json(response.data);
  }
}
```

#### 2.5 — Xóa Auth module khỏi monolith

Sau khi Auth Service mới hoạt động ổn định:
- Xóa `src/modules/auth/` khỏi `apartment-service`
- Xóa model `User` và `RefreshToken` khỏi schema Prisma của `apartment-service`
- Cập nhật `app.module.ts` bỏ `AuthModule`

#### 2.6 — Tiêu chí hoàn thành Phase 2

- [ ] Auth Service chạy độc lập trên port 3001
- [ ] Register, Login, Refresh, Logout, Verify hoạt động qua Gateway
- [ ] Frontend không thay đổi code (vẫn gọi Gateway)
- [ ] Auth module đã được xóa khỏi monolith

---

### Phase 3: Tách Apartment & Booking Services *(5-7 ngày)*

#### 3.1 — Tách Apartment Service

Giữ nguyên project `apartment-service` hiện tại, nhưng:
1. Xóa `modules/auth/`, `modules/booking/`, `modules/notification/`
2. Cập nhật Prisma schema chỉ còn model `Apartment`
3. Đổi port sang `3002`
4. Bỏ FK relation `owner → User` (chỉ lưu `ownerId` dạng string)

#### 3.2 — Tạo Booking Service

```bash
cd apps
npx -y @nestjs/cli@latest new booking-service --skip-git --package-manager npm
```

**Thay đổi logic quan trọng:**

| Vấn đề | Giải pháp |
|---|---|
| Booking cần check apartment tồn tại | Gọi HTTP tới Apartment Service |
| Booking trả về thông tin apartment | Gọi Apartment Service lấy data, merge response |
| Booking cần verify user | Gateway đã inject `x-user-id` header |

```typescript
// apps/booking-service/src/booking/booking.service.ts
@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService, // Gọi Apartment Service
  ) {}

  async create(dto: CreateBookingDto, tenantId: string) {
    // Gọi Apartment Service để check apartment có tồn tại không
    const apartment = await this.getApartment(dto.apartmentId);
    if (!apartment) throw new NotFoundException('Apartment not found');

    // Check availability (giữ nguyên logic cũ)
    const { available } = await this.checkAvailability(
      dto.apartmentId, dto.startDate, dto.endDate
    );
    if (!available) throw new ConflictException('Đã có người đặt');

    return this.prisma.booking.create({ data: { ...dto, tenantId } });
  }

  // Gọi HTTP tới Apartment Service
  private async getApartment(apartmentId: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${process.env.APARTMENT_SERVICE_URL}/api/Apartments/${apartmentId}`
        )
      );
      return data.data;
    } catch {
      return null;
    }
  }
}
```

#### 3.3 — Prisma schema Booking Service

```prisma
// apps/booking-service/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // chứa ?schema=booking
}

enum BookingStatus { PENDING CONFIRMED CANCELLED COMPLETED }

model Booking {
  id          String        @id @default(uuid())
  startDate   DateTime      @db.Date
  endDate     DateTime      @db.Date
  totalPrice  Decimal       @db.Decimal(10, 2)
  status      BookingStatus @default(PENDING)
  tenantId    String        // Chỉ lưu ID, không FK
  apartmentId String        // Chỉ lưu ID, không FK
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  @@map("Bookings")
}
```

#### 3.4 — Cập nhật Gateway routing đầy đủ

```typescript
// Routing map trong Gateway
const SERVICE_MAP = {
  '/api/auth':       process.env.AUTH_SERVICE_URL,       // :3001
  '/api/apartments': process.env.APARTMENT_SERVICE_URL,  // :3002
  '/api/bookings':   process.env.BOOKING_SERVICE_URL,    // :3003
};
```

#### 3.5 — Tiêu chí hoàn thành Phase 3

- [ ] 3 services chạy độc lập, mỗi service dùng Schema riêng trong cùng DB
- [ ] Tất cả API hoạt động thông qua Gateway (Frontend không đổi)
- [ ] Booking Service gọi được Apartment Service qua HTTP
- [ ] docker-compose chạy được tất cả service local

---

### Phase 4: Notification Service + Event-Driven *(3-5 ngày)*

> [!NOTE]
> Phase này thêm tính năng mới: gửi thông báo qua email/SMS khi có sự kiện quan trọng.

#### 4.1 — Chọn Message Queue

| Option | Khi nào dùng | Chi phí |
|---|---|---|
| **RabbitMQ** | Dev local, self-hosted | Free |
| **AWS SQS** | Production trên AWS | Free Tier: 1M requests/tháng |
| **Redis Pub/Sub** | Đơn giản, đã có Redis | Free |

**Khuyến nghị**: Dùng **RabbitMQ** cho local dev, chuyển sang **AWS SQS** khi deploy.

#### 4.2 — Event flow

```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant BookingSvc as Booking Service
    participant MQ as Message Queue
    participant NotiSvc as Notification Service
    participant Email as Email Provider

    Client->>Gateway: POST /api/bookings
    Gateway->>BookingSvc: Forward (with x-user-id)
    BookingSvc->>BookingSvc: Create booking in DB
    BookingSvc->>MQ: Publish "booking.created" event
    BookingSvc-->>Gateway: 201 Created
    Gateway-->>Client: Response

    MQ->>NotiSvc: Consume "booking.created"
    NotiSvc->>Email: Send confirmation email
```

#### 4.3 — Các events cần implement

| Event | Producer | Consumer | Action |
|---|---|---|---|
| `user.registered` | Auth Service | Notification | Welcome email |
| `booking.created` | Booking Service | Notification | Confirmation email |
| `booking.cancelled` | Booking Service | Notification | Cancellation email |
| `booking.confirmed` | Booking Service | Notification | Confirmed email |

#### 4.4 — Tiêu chí hoàn thành Phase 4

- [ ] Message Queue chạy (RabbitMQ container)
- [ ] Booking Service publish events thành công
- [ ] Notification Service consume và xử lý events
- [ ] Email gửi được (có thể dùng Mailtrap để test)

---

### Phase 5: CI/CD + Deploy lên AWS *(5-7 ngày)*

> [!IMPORTANT]
> Phase cuối cùng — đưa toàn bộ hệ thống lên cloud.

#### 5.1 — Kiến trúc AWS đề xuất

```mermaid
graph TB
    subgraph "AWS Cloud"
        subgraph "Frontend"
            CF["CloudFront CDN"]
            S3["S3 Bucket<br/>(Static files)"]
            CF --> S3
        end
        
        subgraph "Backend - ECS Fargate"
            ALB["Application<br/>Load Balancer"]
            GW_C["API Gateway<br/>Container"]
            AUTH_C["Auth Service<br/>Container"]
            APT_C["Apartment Service<br/>Container"]
            BK_C["Booking Service<br/>Container"]
            NTF_C["Notification<br/>Container"]
            
            ALB --> GW_C
            GW_C --> AUTH_C
            GW_C --> APT_C
            GW_C --> BK_C
        end
        
        subgraph "Data Layer"
            RDS["RDS PostgreSQL<br/>(Multi-AZ)"]
            REDIS["ElastiCache<br/>Redis"]
            SQS["SQS Queue"]
        end
        
        subgraph "DevOps"
            ECR["ECR<br/>(Docker Registry)"]
            SM["Secrets Manager"]
        end
        
        AUTH_C --> RDS
        APT_C --> RDS
        BK_C --> RDS
        AUTH_C --> REDIS
        BK_C --> SQS
        SQS --> NTF_C
    end
    
    USER["👤 User"] --> CF
    USER --> ALB
```

#### 5.2 — AWS Services cần dùng

| Service | Mục đích | Free Tier |
|---|---|---|
| **ECS Fargate** | Chạy containers (serverless) | Không (≈ $30-50/tháng cho cả cluster) |
| **ECR** | Docker image registry | 500MB free |
| **RDS PostgreSQL** | Database | 750h/tháng (t3.micro) |
| **ElastiCache Redis** | Session cache | Không free |
| **S3 + CloudFront** | Frontend hosting | 5GB S3 + 50GB transfer |
| **SQS** | Message queue | 1M requests free |
| **Secrets Manager** | Quản lý secrets | $0.40/secret/tháng |
| **Route 53** | Domain + DNS | $0.50/hosted zone |

> [!TIP]
> **Tiết kiệm chi phí:** Trong kiến trúc mới, vì chúng ta dùng cơ chế **1 Database - Nhiều schema**, bạn chỉ cần duy nhất 1 RDS instance cho toàn bộ hệ thống.

#### 5.3 — CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/auth-service.yml
name: Auth Service CI/CD

on:
  push:
    paths:
      - 'apps/auth-service/**'
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-southeast-1
      
      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2
      
      - name: Build & Push Docker Image
        run: |
          docker build -t auth-service ./apps/auth-service
          docker tag auth-service:latest $ECR_REGISTRY/auth-service:${{ github.sha }}
          docker push $ECR_REGISTRY/auth-service:${{ github.sha }}
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster apart-cluster \
            --service auth-service \
            --force-new-deployment
```

**Đặc điểm CI/CD:**
- **Independent deployments** — Mỗi service có pipeline riêng
- **Triggered by path** — Chỉ build service nào thay đổi code
- **Docker image tagging** — Dùng git SHA làm tag

#### 5.4 — docker-compose Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  api-gateway:
    build: ./apps/api-gateway
    ports: ["80:3000"]
    environment:
      AUTH_SERVICE_URL: http://auth-service:3001
      APARTMENT_SERVICE_URL: http://apartment-service:3002
      BOOKING_SERVICE_URL: http://booking-service:3003
    depends_on: [auth-service, apartment-service, booking-service]
    networks: [apart-network]

  auth-service:
    build: ./apps/auth-service
    ports: ["3001:3001"]
    environment:
      DATABASE_URL: postgresql://user:password@database:5432/apart_booking?schema=auth
      JWT_SECRET: ${JWT_SECRET}
    depends_on: [database]
    networks: [apart-network]

  apartment-service:
    build: ./apps/apartment-service
    ports: ["3002:3002"]
    environment:
      DATABASE_URL: postgresql://user:password@database:5432/apart_booking?schema=apartment
    depends_on: [database]
    networks: [apart-network]

  booking-service:
    build: ./apps/booking-service
    ports: ["3003:3003"]
    environment:
      DATABASE_URL: postgresql://user:password@database:5432/apart_booking?schema=booking
      APARTMENT_SERVICE_URL: http://apartment-service:3002
    depends_on: [database, apartment-service]
    networks: [apart-network]

  notification-service:
    build: ./apps/notification-service
    environment:
      RABBITMQ_URL: amqp://rabbitmq:5672
    depends_on: [rabbitmq]
    networks: [apart-network]

  database:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - ./init-schemas.sql:/docker-entrypoint-initdb.d/init.sql
      - pgdata:/var/lib/postgresql/data
    networks: [apart-network]

  rabbitmq:
    image: rabbitmq:3-management
    ports: ["5672:5672", "15672:15672"]
    networks: [apart-network]

networks:
  apart-network:
    driver: bridge

volumes:
  pgdata:
```

#### 5.5 — Tiêu chí hoàn thành Phase 5

- [ ] Docker images build thành công cho tất cả services
- [ ] GitHub Actions CI/CD pipeline chạy green
- [ ] Hệ thống deploy lên AWS ECS thành công
- [ ] Frontend serve qua CloudFront + S3
- [ ] Domain custom hoạt động (HTTPS)
- [ ] Health check endpoints trả về OK

---

## ⏰ Timeline Tổng Quan

```mermaid
gantt
    title Lộ trình triển khai Microservice - APARTAWS
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m

    section Phase 0
    Học tập & Chuẩn bị       :p0, 2026-04-14, 2d

    section Phase 1
    Tạo API Gateway           :p1a, after p0, 2d
    Tách Database schemas     :p1b, after p1a, 2d
    Test Gateway integration  :p1c, after p1b, 1d

    section Phase 2
    Tạo Auth Service          :p2a, after p1c, 2d
    Migrate auth code         :p2b, after p2a, 1d
    Test & cleanup monolith   :p2c, after p2b, 1d

    section Phase 3
    Tách Apartment Service    :p3a, after p2c, 2d
    Tạo Booking Service       :p3b, after p3a, 3d
    Test cross-service comm   :p3c, after p3b, 2d

    section Phase 4
    Setup Message Queue       :p4a, after p3c, 1d
    Notification Service      :p4b, after p4a, 2d
    Event integration test    :p4c, after p4b, 2d

    section Phase 5
    AWS Infrastructure        :p5a, after p4c, 2d
    CI/CD Pipeline            :p5b, after p5a, 2d
    Deploy & Go-live          :p5c, after p5b, 3d
```

| Phase | Nội dung | Thời gian | Tổng tích lũy |
|---|---|---|---|
| **Phase 0** | Học tập & Chuẩn bị | 1-2 ngày | 2 ngày |
| **Phase 1** | API Gateway + Tách Schema | 3-5 ngày | 7 ngày |
| **Phase 2** | Tách Auth Service | 3-4 ngày | 11 ngày |
| **Phase 3** | Tách Apartment + Booking | 5-7 ngày | 18 ngày |
| **Phase 4** | Notification + MQ | 3-5 ngày | 23 ngày |
| **Phase 5** | CI/CD + Deploy AWS | 5-7 ngày | **30 ngày** |

> **Tổng ước tính: ~4-5 tuần** (part-time) hoặc **~2-3 tuần** (full-time)

---

## ⚠️ Rủi Ro & Lưu Ý

| Rủi ro | Mức độ | Giải pháp |
|---|---|---|
| **Data consistency** khi tách Schema | 🔴 Cao | Dùng Saga pattern hoặc eventual consistency |
| **Network latency** giữa services | 🟡 Trung bình | Dùng service mesh, retry + circuit breaker |
| **Debugging phức tạp hơn** | 🟡 Trung bình | Centralized logging (CloudWatch), distributed tracing |
| **Chi phí AWS** tăng | 🟡 Trung bình | Bắt đầu với ECS Fargate Spot, 1 RDS shared |
| **Over-engineering** cho dự án nhỏ | 🟢 Thấp | Chỉ tách khi thực sự cần scale |

> [!CAUTION]
> **Lưu ý quan trọng**: Microservice không phải lúc nào cũng tốt hơn monolith. Với quy mô hiện tại (4 modules, 4 tables), monolith vẫn hoàn toàn đủ dùng. Chỉ nên chuyển sang microservice khi:
> - Team có nhiều người, cần deploy độc lập
> - Một module cần scale riêng (ví dụ: Booking traffic cao hơn Auth)
> - Muốn học và thực hành kiến trúc cloud-native

---

## 🚀 Bước Tiếp Theo

Bạn muốn tôi bắt đầu triển khai **Phase nào** trước? Tôi đề xuất:

1. **Phase 1** — Tạo API Gateway (ưu tiên nhất, nền tảng cho mọi thứ)
2. **Phase 2** — Tách Auth Service (service đơn giản nhất, ít phụ thuộc)

Hoặc nếu bạn có câu hỏi nào về kế hoạch, hãy cho tôi biết!
