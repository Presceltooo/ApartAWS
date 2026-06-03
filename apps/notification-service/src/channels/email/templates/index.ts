const commonStyle = `
  body { font-family: 'Outfit', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f9fc; color: #2D3748; margin: 0; padding: 20px; line-height: 1.6; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #E2E8F0; }
  .header { background: linear-gradient(135deg, #3182CE 0%, #2B6CB0 100%); padding: 30px 20px; text-align: center; color: white; }
  .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
  .content { padding: 30px 24px; }
  .footer { background-color: #F7FAFC; padding: 20px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #EDF2F7; }
  .details-box { background-color: #EDF2F7; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .details-title { font-weight: bold; font-size: 16px; margin-bottom: 12px; border-bottom: 2px solid #CBD5E0; padding-bottom: 6px; color: #2B6CB0; }
  .details-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
  .details-label { color: #4A5568; font-weight: 600; }
  .details-value { color: #2D3748; text-align: right; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
  .badge-pending { background-color: #FEFCBF; color: #B7791F; }
  .badge-confirmed { background-color: #C6F6D5; color: #22543D; }
  .badge-cancelled { background-color: #FED7D7; color: #9B2C2C; }
  .badge-completed { background-color: #E2E8F0; color: #4A5568; }
  .button { display: inline-block; padding: 12px 24px; background-color: #3182CE; color: white !important; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; margin-top: 15px; text-align: center; }
  .button:hover { background-color: #2B6CB0; }
  .text-center { text-align: center; }
`;

export function getBookingCreatedTenantEmail(payload: any): string {
  const isAuto = payload.bookingStatus === 'CONFIRMED';
  const statusLabel = isAuto ? 'Đã duyệt thành công (Tự động)' : 'Đang chờ duyệt';
  const badgeClass = isAuto ? 'badge-confirmed' : 'badge-pending';
  
  return `
    <html>
      <head>
        <style>${commonStyle}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Cảm ơn bạn đã đặt phòng!</h1>
          </div>
          <div class="content">
            <p>Xin chào <strong>${payload.tenantName || 'Khách hàng'}</strong>,</p>
            <p>Yêu cầu đặt phòng của bạn tại căn hộ <strong>${payload.apartmentTitle}</strong> đã được hệ thống ghi nhận.</p>
            
            <div class="details-box">
              <div class="details-title">Thông tin đặt phòng</div>
              <div class="details-row">
                <span class="details-label">Mã đặt phòng:</span>
                <span class="details-value"><code>${payload.bookingId}</code></span>
              </div>
              <div class="details-row">
                <span class="details-label">Nhận phòng (Check-in):</span>
                <span class="details-value">${new Date(payload.startDate).toLocaleDateString('vi-VN')}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Trả phòng (Check-out):</span>
                <span class="details-value">${new Date(payload.endDate).toLocaleDateString('vi-VN')}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Số đêm lưu trú:</span>
                <span class="details-value">${payload.nights} đêm</span>
              </div>
              <div class="details-row">
                <span class="details-label">Tổng chi phí:</span>
                <span class="details-value" style="font-weight: bold; color: #2B6CB0;">${Number(payload.totalPrice).toLocaleString('vi-VN')} ₫</span>
              </div>
              <div class="details-row">
                <span class="details-label">Trạng thái:</span>
                <span class="details-value"><span class="badge ${badgeClass}">${statusLabel}</span></span>
              </div>
            </div>

            ${!isAuto ? `<p>Chủ căn hộ sẽ kiểm tra và xác nhận yêu cầu của bạn sớm nhất có thể. Chúng tôi sẽ thông báo ngay khi có kết quả.</p>` : ''}
            
            <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email support@apartaws.com.</p>
            
            <div class="text-center">
              <a href="https://dtc-prescelto.tech/bookings/${payload.bookingId}" class="button">Chi tiết đơn đặt phòng</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ApartAWS. All rights reserved.</p>
            <p>Hệ thống đặt phòng căn hộ cao cấp và tiện ích.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getBookingCreatedOwnerEmail(payload: any): string {
  const isAuto = payload.bookingStatus === 'CONFIRMED';
  const title = isAuto ? 'Căn hộ của bạn đã được đặt thành công!' : 'Yêu cầu đặt phòng mới cần duyệt!';
  
  return `
    <html>
      <head>
        <style>${commonStyle}</style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="background: linear-gradient(135deg, #805AD5 0%, #553C9A 100%);">
            <h1>${title}</h1>
          </div>
          <div class="content">
            <p>Xin chào <strong>${payload.ownerName || 'Chủ nhà'}</strong>,</p>
            <p>Căn hộ <strong>${payload.apartmentTitle}</strong> của bạn vừa nhận được đơn đặt phòng từ khách thuê <strong>${payload.tenantName || 'Khách hàng'}</strong>.</p>
            
            <div class="details-box">
              <div class="details-title">Thông tin chi tiết</div>
              <div class="details-row">
                <span class="details-label">Mã đặt phòng:</span>
                <span class="details-value"><code>${payload.bookingId}</code></span>
              </div>
              <div class="details-row">
                <span class="details-label">Khách thuê:</span>
                <span class="details-value">${payload.tenantName} (${payload.tenantEmail || 'N/A'})</span>
              </div>
              <div class="details-row">
                <span class="details-label">Nhận phòng:</span>
                <span class="details-value">${new Date(payload.startDate).toLocaleDateString('vi-VN')}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Trả phòng:</span>
                <span class="details-value">${new Date(payload.endDate).toLocaleDateString('vi-VN')}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Số đêm:</span>
                <span class="details-value">${payload.nights} đêm</span>
              </div>
              <div class="details-row">
                <span class="details-label">Thu nhập dự kiến:</span>
                <span class="details-value" style="font-weight: bold; color: #805AD5;">${Number(payload.totalPrice).toLocaleString('vi-VN')} ₫</span>
              </div>
              <div class="details-row">
                <span class="details-label">Cơ chế duyệt:</span>
                <span class="details-value">${isAuto ? 'Duyệt tự động (Auto-approve)' : 'Yêu cầu duyệt thủ công'}</span>
              </div>
            </div>

            ${!isAuto ? `
              <p>Vui lòng đăng nhập vào hệ thống để duyệt hoặc từ chối yêu cầu đặt phòng này sớm nhất có thể.</p>
              <div class="text-center">
                <a href="https://dtc-prescelto.tech/owner/bookings" class="button" style="background-color: #805AD5;">Xem và duyệt ngay</a>
              </div>
            ` : `
              <p>Đơn hàng đã được duyệt tự động. Khách thuê sẽ tiến hành thanh toán.</p>
              <div class="text-center">
                <a href="https://dtc-prescelto.tech/owner/bookings" class="button" style="background-color: #805AD5;">Xem đơn hàng</a>
              </div>
            `}
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ApartAWS. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getBookingConfirmedEmail(payload: any): string {
  return `
    <html>
      <head>
        <style>${commonStyle}</style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="background: linear-gradient(135deg, #38A169 0%, #276749 100%);">
            <h1>Đặt phòng của bạn đã được duyệt!</h1>
          </div>
          <div class="content">
            <p>Xin chào <strong>${payload.tenantName || 'Khách hàng'}</strong>,</p>
            <p>Chúng tôi vui mừng thông báo rằng chủ nhà đã **xác nhận duyệt** yêu cầu đặt phòng của bạn tại căn hộ <strong>${payload.apartmentTitle}</strong>.</p>
            
            <div class="details-box">
              <div class="details-title">Đơn hàng đã duyệt</div>
              <div class="details-row">
                <span class="details-label">Căn hộ:</span>
                <span class="details-value" style="font-weight: bold;">${payload.apartmentTitle}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Mã đặt phòng:</span>
                <span class="details-value"><code>${payload.bookingId}</code></span>
              </div>
              <div class="details-row">
                <span class="details-label">Nhận phòng:</span>
                <span class="details-value">${new Date(payload.startDate).toLocaleDateString('vi-VN')}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Trả phòng:</span>
                <span class="details-value">${new Date(payload.endDate).toLocaleDateString('vi-VN')}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Tổng tiền:</span>
                <span class="details-value" style="font-weight: bold; color: #38A169;">${Number(payload.totalPrice).toLocaleString('vi-VN')} ₫</span>
              </div>
              <div class="details-row">
                <span class="details-label">Trạng thái:</span>
                <span class="details-value"><span class="badge badge-confirmed">Đã duyệt</span></span>
              </div>
            </div>

            <p>Bước tiếp theo: Vui lòng tiến hành thanh toán tiền đặt phòng để giữ chỗ căn hộ.</p>
            
            <div class="text-center">
              <a href="https://dtc-prescelto.tech/bookings/${payload.bookingId}" class="button" style="background-color: #38A169;">Thanh toán ngay</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ApartAWS. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getBookingCancelledEmail(payload: any, role: 'tenant' | 'owner'): string {
  const recipientName = role === 'tenant' ? (payload.tenantName || 'Khách hàng') : (payload.ownerName || 'Chủ nhà');
  const whoCancelledText = role === 'tenant' ? 'đơn đặt phòng của bạn đã bị hủy thành công' : `đơn đặt phòng mã ${payload.bookingId} đã được hủy`;
  
  return `
    <html>
      <head>
        <style>${commonStyle}</style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="background: linear-gradient(135deg, #E53E3E 0%, #9B2C2C 100%);">
            <h1>Thông báo hủy đặt phòng</h1>
          </div>
          <div class="content">
            <p>Xin chào <strong>${recipientName}</strong>,</p>
            <p>Chúng tôi thông báo rằng ${whoCancelledText} tại căn hộ <strong>${payload.apartmentTitle}</strong>.</p>
            
            <div class="details-box">
              <div class="details-title">Thông tin đặt phòng (ĐÃ HỦY)</div>
              <div class="details-row">
                <span class="details-label">Căn hộ:</span>
                <span class="details-value">${payload.apartmentTitle}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Mã đặt phòng:</span>
                <span class="details-value"><code>${payload.bookingId}</code></span>
              </div>
              <div class="details-row">
                <span class="details-label">Thời gian:</span>
                <span class="details-value">${new Date(payload.startDate).toLocaleDateString('vi-VN')} - ${new Date(payload.endDate).toLocaleDateString('vi-VN')}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Trạng thái:</span>
                <span class="details-value"><span class="badge badge-cancelled">Đã hủy</span></span>
              </div>
            </div>

            <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với bộ phận CSKH để được hỗ trợ kịp thời.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ApartAWS. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getBookingCompletedEmail(payload: any): string {
  return `
    <html>
      <head>
        <style>${commonStyle}</style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="background: linear-gradient(135deg, #4A5568 0%, #2D3748 100%);">
            <h1>Cảm ơn bạn đã lưu trú cùng chúng tôi!</h1>
          </div>
          <div class="content">
            <p>Xin chào <strong>${payload.tenantName || 'Khách hàng'}</strong>,</p>
            <p>Chúng tôi nhận thấy đơn đặt phòng mã <code>${payload.bookingId}</code> tại căn hộ <strong>${payload.apartmentTitle}</strong> của bạn đã **hoàn thành tốt đẹp**.</p>
            
            <p>Chúng tôi hy vọng bạn đã có một trải nghiệm nghỉ ngơi tuyệt vời. Hãy dành vài phút để đánh giá căn hộ và gửi ý kiến phản hồi nhé!</p>

            <div class="details-box">
              <div class="details-title">Chi tiết lịch sử lưu trú</div>
              <div class="details-row">
                <span class="details-label">Căn hộ:</span>
                <span class="details-value">${payload.apartmentTitle}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Thời gian lưu trú:</span>
                <span class="details-value">${new Date(payload.startDate).toLocaleDateString('vi-VN')} - ${new Date(payload.endDate).toLocaleDateString('vi-VN')}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Tổng chi phí:</span>
                <span class="details-value" style="font-weight: bold;">${Number(payload.totalPrice).toLocaleString('vi-VN')} ₫</span>
              </div>
              <div class="details-row">
                <span class="details-label">Trạng thái đặt phòng:</span>
                <span class="details-value"><span class="badge badge-completed">Hoàn thành</span></span>
              </div>
            </div>

            <div class="text-center">
              <a href="https://dtc-prescelto.tech/apartments/${payload.apartmentId}" class="button" style="background-color: #4A5568;">Đánh giá căn hộ</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ApartAWS. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getPaymentSuccessEmail(payload: any, role: 'tenant' | 'owner'): string {
  const recipientName = role === 'tenant' ? (payload.tenantName || 'Khách hàng') : (payload.ownerName || 'Chủ nhà');
  const title = role === 'tenant' ? 'Thanh toán thành công đặt phòng!' : 'Khách đã thanh toán thành công!';
  
  return `
    <html>
      <head>
        <style>${commonStyle}</style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="background: linear-gradient(135deg, #319795 0%, #234E52 100%);">
            <h1>${title}</h1>
          </div>
          <div class="content">
            <p>Xin chào <strong>${recipientName}</strong>,</p>
            <p>${role === 'tenant' ? 'Giao dịch thanh toán đặt phòng của bạn đã thành công.' : 'Hệ thống xác nhận khách thuê đã thanh toán thành công cho đơn đặt phòng.'}</p>
            
            <div class="details-box">
              <div class="details-title">Chi tiết thanh toán</div>
              <div class="details-row">
                <span class="details-label">Căn hộ:</span>
                <span class="details-value">${payload.apartmentTitle}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Mã đặt phòng:</span>
                <span class="details-value"><code>${payload.bookingId}</code></span>
              </div>
              <div class="details-row">
                <span class="details-label">Mã giao dịch VNPay:</span>
                <span class="details-value"><code>${payload.transactionId || 'N/A'}</code></span>
              </div>
              <div class="details-row">
                <span class="details-label font-weight-bold">Số tiền:</span>
                <span class="details-value font-weight-bold" style="color: #319795;">${Number(payload.totalPrice).toLocaleString('vi-VN')} ₫</span>
              </div>
              <div class="details-row">
                <span class="details-label">Thời gian giao dịch:</span>
                <span class="details-value">${new Date().toLocaleString('vi-VN')}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Trạng thái thanh toán:</span>
                <span class="details-value"><span class="badge badge-confirmed">Đã thanh toán</span></span>
              </div>
            </div>
            
            <p>Cảm ơn sự đồng hành của bạn cùng hệ thống ApartAWS.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ApartAWS. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getPaymentFailedEmail(payload: any): string {
  return `
    <html>
      <head>
        <style>${commonStyle}</style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="background: linear-gradient(135deg, #DD6B20 0%, #9C4221 100%);">
            <h1>Thanh toán không thành công!</h1>
          </div>
          <div class="content">
            <p>Xin chào <strong>${payload.tenantName || 'Khách hàng'}</strong>,</p>
            <p>Chúng tôi rất tiếc khi giao dịch thanh toán trực tuyến cho đơn hàng tại căn hộ <strong>${payload.apartmentTitle}</strong> đã không thể hoàn tất.</p>
            
            <div class="details-box" style="border-left: 4px solid #DD6B20;">
              <div class="details-title" style="color: #DD6B20;">Lý do thất bại</div>
              <p style="margin: 0; font-size: 14px;">${payload.failureReason || 'Giao dịch bị từ chối hoặc bị hủy từ cổng thanh toán.'}</p>
            </div>

            <div class="details-box">
              <div class="details-title">Thông tin đặt phòng</div>
              <div class="details-row">
                <span class="details-label">Mã đặt phòng:</span>
                <span class="details-value"><code>${payload.bookingId}</code></span>
              </div>
              <div class="details-row">
                <span class="details-label">Số tiền cần thanh toán:</span>
                <span class="details-value" style="font-weight: bold; color: #DD6B20;">${Number(payload.totalPrice).toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>

            <p>Vui lòng đăng nhập lại và thực hiện thanh toán lại hoặc chọn phương thức thanh toán khác.</p>
            
            <div class="text-center">
              <a href="https://dtc-prescelto.tech/bookings/${payload.bookingId}" class="button" style="background-color: #DD6B20;">Thử thanh toán lại</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ApartAWS. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
