export enum MessageError {
  // General
  NOT_FOUND = 'Không tìm thấy dữ liệu',
  UNAUTHORIZED = 'Bạn không có quyền truy cập',
  FORBIDDEN = 'Truy cập bị từ chối',
  BAD_REQUEST = 'Dữ liệu không hợp lệ',
  INTERNAL_SERVER_ERROR = 'Lỗi hệ thống, vui lòng thử lại sau',

  // Apartment
  APARTMENT_NOT_FOUND = 'Không tìm thấy căn hộ',
  APARTMENT_ALREADY_EXISTS = 'Căn hộ đã tồn tại',
  APARTMENT_NOT_AVAILABLE = 'Căn hộ không khả dụng',

  // Booking
  BOOKING_NOT_FOUND = 'Không tìm thấy đơn đặt phòng',
  BOOKING_CONFLICT = 'Căn hộ đã được đặt trong khoảng thời gian này',
  BOOKING_CANNOT_CANCEL = 'Không thể hủy đơn đặt phòng này',
  BOOKING_INVALID_DATE = 'Ngày đặt phòng không hợp lệ',

  // User
  USER_NOT_FOUND = 'Không tìm thấy người dùng',
  USER_ALREADY_EXISTS = 'Người dùng đã tồn tại',

  // Payment
  PAYMENT_FAILED = 'Thanh toán thất bại',
  PAYMENT_NOT_FOUND = 'Không tìm thấy giao dịch thanh toán',
}
