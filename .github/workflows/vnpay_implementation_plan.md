# Kế hoạch triển khai thanh toán VNPay

Tài liệu này mô tả các bước cần thiết để tích hợp cổng thanh toán VNPay vào dự án ApartAWS.

## 1. Yêu cầu chuẩn bị
- Tài khoản Sandbox VNPay (TMN Code, Hash Secret).
- Cập nhật biến môi trường (`.env`).

## 2. Backend (Booking Service)

### A. Cập nhật Database Schema
Thêm các trường thông tin thanh toán vào model `Booking` trong `schema.prisma`:
- `paymentStatus`: Trạng thái thanh toán (UNPAID, PAID, FAILED).
- `vnpTransactionId`: Mã giao dịch của VNPay.
- `paymentDate`: Ngày thanh toán thành công.

### B. Cài đặt thư viện bổ sung
- `moment`: Để định dạng thời gian theo chuẩn VNPay (yyyyMMddHHmmss).
- `crypto`: (Built-in) Để tạo chữ ký HMAC-SHA512.

### C. Triển khai logic VNPay
1. **VNPay Service**:
   - Hàm `createPaymentUrl(bookingId, amount, ipAddr)`: Tạo URL chuyển hướng người dùng sang VNPay.
   - Hàm `validateReturn(vnp_Params)`: Kiểm tra chữ ký phản hồi từ VNPay.
2. **Payment Controller**:
   - `GET /payments/vnpay-url/:bookingId`: API cho Frontend gọi để lấy link thanh toán.
   - `GET /payments/vnpay-return`: Xử lý kết quả trả về sau khi thanh toán (chuyển hướng về Frontend).
   - `GET /payments/vnpay-ipn`: Xử lý thông báo ngầm từ VNPay (Server-to-Server) để cập nhật trạng thái đơn hàng tin cậy hơn.

## 3. Frontend (Web Portal)

### A. Giao diện chi tiết đơn đặt phòng
- Hiển thị nút "Thanh toán VNPay" cho các đơn hàng có trạng thái `PENDING` và chưa thanh toán.
- Khi click, gọi API backend để lấy URL và chuyển hướng người dùng.

### B. Trang kết quả thanh toán
- Tạo route mới (ví dụ: `/payment/result`) để hiển thị thông báo thành công hoặc thất bại dựa trên query parameters từ VNPay.

## 4. Các bước thực hiện chi tiết

### Bước 1: Cập nhật Prisma Schema & Migrations
```prisma
enum PaymentStatus {
  UNPAID
  PAID
  FAILED
  REFUNDED
}

model Booking {
  // ... existing fields
  paymentStatus  PaymentStatus @default(UNPAID)
  vnpTransactionId String?
  paymentDate      DateTime?
}
```

### Bước 3: Cấu hình Nginx & API Gateway
Đảm bảo các route `/payments/*` được forward đúng vào `booking-service`.

---
Bạn có muốn tôi bắt đầu triển khai phần **Backend (Booking Service)** trước không?
