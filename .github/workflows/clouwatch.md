# KẾ HOẠCH TRIỂN KHAI HỆ THỐNG GIÁM SÁT AWS CLOUDWATCH
**Dự án:** ApartAWS (Hệ thống quản lý đặt phòng Microservices)
**Mục tiêu:** Giám sát toàn diện hạ tầng và ứng dụng, phục vụ báo cáo khóa luận.

---

## 1. Mục tiêu triển khai
1.  **Quản lý Log tập trung:** Gom logs từ các Microservices (Auth, Apartment, Booking) về một nơi.
2.  **Giám sát hiệu năng:** Theo dõi CPU, RAM, Disk và Latency của hệ thống.
3.  **Cảnh báo tự động:** Phát hiện sớm sự cố thanh toán (VNPay) hoặc hệ thống quá tải để thông báo qua Email.
4.  **Minh chứng thực nghiệm:** Cung cấp số liệu, biểu đồ thực tế cho nội dung khóa luận.

## 2. Các giai đoạn thực hiện

### Giai đoạn 1: Chuẩn bị hạ tầng & Quyền (Infrastructure & IAM)
*   **Công việc:**
    1.  Cập nhật IAM Role hiện tại (`EC2-Pull-From-ECR-Role`) bằng cách đính kèm thêm policy `CloudWatchAgentServerPolicy`.
    2.  Xác nhận toàn bộ EC2 Instances đã được gán Role này.
    3.  Kiểm tra Basic Monitoring trên bảng điều khiển EC2 (mặc định 5 phút/lần).
*   **Kết quả:** EC2 có đủ quyền để gửi dữ liệu về CloudWatch.

### Giai đoạn 2: Log tập trung (Centralized Logging)
*   **Công việc:**
    1.  **Cài đặt CloudWatch Agent:** Chạy lệnh cài đặt trên 3 máy chủ EC2.
    2.  **Cấu hình Agent:** Tạo file `amazon-cloudwatch-agent.json` để định nghĩa:
        *   Thu thập Metrics hệ thống: CPU, Memory, Disk usage.
        *   Thu thập Log ứng dụng: `/home/ubuntu/logs/*.log`.
    3.  **Khởi động Agent:** `sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl ...`
*   **Kết quả:** Logs bắt đầu xuất hiện tại CloudWatch Log Groups theo từng Service.

### Giai đoạn 3: Phân tích & Cảnh báo (Metrics & Alarms)
*   **Công việc:**
    1.  **Log Metric Filters:** Tạo filter lọc từ khóa `ERROR`, `Exception`, `VNPay Failure`.
    2.  **Thiết lập SNS:** Tạo Topic `ApartAWS-Alerts` và đăng ký Email nhận tin.
    3.  **Tạo Alarms:**
        *   *Alarm 1:* CPU Utilization > 80% trong 5 phút.
        *   *Alarm 2:* 4XX/5XX Error rate > 10 request/phút.
        *   *Alarm 3:* Ổ đĩa đầy > 90%.
*   **Kết quả:** Nhận được email cảnh báo khi giả lập sự cố.

### Giai đoạn 4: Trực quan hóa & Báo cáo (Dashboards & Reporting)
*   **Công việc:**
    1.  **Tạo Dashboard:** Thiết kế trang `ApartAWS-Global-Monitoring`.
    2.  **Widget:** Thêm biểu đồ đường cho CPU, biểu đồ cột cho mã lỗi HTTP, biểu đồ tròn cho trạng thái Booking.
    3.  **Stress Test:** Sử dụng công cụ (JMeter/Apache Benchmark) để tạo tải ảo, lấy dữ liệu biểu đồ cho khóa luận.
*   **Kết quả:** Bộ sưu tập hình ảnh biểu đồ và số liệu thực tế cho báo cáo.

---

## 3. Danh mục các thông số giám sát (Key Metrics)

| Thành phần | Thông số theo dõi | Tần suất |
| :--- | :--- | :--- |
| **Hạ tầng (EC2)** | CPU, RAM, Network In/Out, Disk Space | 5 phút |
| **Ứng dụng** | API Latency, HTTP 200/400/500 Count | 1 phút |
| **Log nghiệp vụ** | Lỗi thanh toán, Lỗi xác thực, Transaction Log | Thời gian thực |

---

## 4. Dự kiến kết quả đạt được trong khóa luận
*   **Chương 4 - Thực nghiệm:** Hình ảnh Dashboard giám sát lúc hệ thống đang chạy thực tế.
*   **Chương 5 - Đánh giá:** Phân tích biểu đồ khi có nhiều người dùng truy cập đồng thời. Chứng minh hệ thống có khả năng tự động phát hiện lỗi nhờ CloudWatch Alarms.
