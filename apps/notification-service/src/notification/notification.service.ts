import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../channels/email/email.service';
import { NotificationEvent, NotificationEventType } from '../common/interfaces/notification-event.interface';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService,
  ) {}

  async handleEvent(event: NotificationEvent): Promise<void> {
    this.logger.log(`Handling notification event of type: ${event.eventType}`);
    const payload = event.payload;

    try {
      switch (event.eventType) {
        case NotificationEventType.BOOKING_CREATED:
          // Gửi email
          await this.emailService.sendBookingCreatedEmail(payload);
          
          // Lưu DB cho Owner (nếu có)
          if (payload.ownerId) {
            await this.createNotification({
              tieuDe: 'Yêu cầu đặt phòng mới',
              noiDung: `Bạn có một yêu cầu đặt phòng mới cho căn hộ "${payload.apartmentTitle}".`,
              nguoiNhanId: payload.ownerId,
              loai: NotificationType.BOOKING,
              nghiepVu: 'BOOKING',
              idDoiTuongLienQuan: payload.bookingId,
              urlDieuHuong: '/quan-ly/quan-ly-dat-phong',
            });
          }

          // Lưu DB cho Tenant
          if (payload.tenantId) {
            await this.createNotification({
              tieuDe: 'Đã tạo đơn đặt phòng thành công',
              noiDung: `Đơn đặt phòng cho căn hộ "${payload.apartmentTitle}" đã được gửi thành công và đang chờ xác nhận.`,
              nguoiNhanId: payload.tenantId,
              loai: NotificationType.BOOKING,
              nghiepVu: 'BOOKING',
              idDoiTuongLienQuan: payload.bookingId,
              urlDieuHuong: '/quan-ly/quan-ly-dat-phong',
            });
          }
          break;

        case NotificationEventType.BOOKING_CONFIRMED:
          await this.emailService.sendBookingConfirmedEmail(payload);
          
          if (payload.tenantId) {
            await this.createNotification({
              tieuDe: 'Đơn đặt phòng đã được xác nhận',
              noiDung: `Đơn đặt phòng của bạn cho căn hộ "${payload.apartmentTitle}" đã được chủ nhà xác nhận thành công!`,
              nguoiNhanId: payload.tenantId,
              loai: NotificationType.BOOKING,
              nghiepVu: 'BOOKING',
              idDoiTuongLienQuan: payload.bookingId,
              urlDieuHuong: '/quan-ly/quan-ly-dat-phong',
            });
          }
          break;

        case NotificationEventType.BOOKING_CANCELLED:
          await this.emailService.sendBookingCancelledEmail(payload);
          
          if (payload.tenantId) {
            await this.createNotification({
              tieuDe: 'Đơn đặt phòng đã bị huỷ',
              noiDung: `Đơn đặt phòng của bạn cho căn hộ "${payload.apartmentTitle}" đã bị huỷ.`,
              nguoiNhanId: payload.tenantId,
              loai: NotificationType.BOOKING,
              nghiepVu: 'BOOKING',
              idDoiTuongLienQuan: payload.bookingId,
              urlDieuHuong: '/quan-ly/quan-ly-dat-phong',
            });
          }

          if (payload.ownerId) {
            await this.createNotification({
              tieuDe: 'Đơn đặt phòng đã bị huỷ',
              noiDung: `Đơn đặt phòng cho căn hộ "${payload.apartmentTitle}" đã bị huỷ.`,
              nguoiNhanId: payload.ownerId,
              loai: NotificationType.BOOKING,
              nghiepVu: 'BOOKING',
              idDoiTuongLienQuan: payload.bookingId,
              urlDieuHuong: '/quan-ly/quan-ly-dat-phong',
            });
          }
          break;

        case NotificationEventType.BOOKING_COMPLETED:
          await this.emailService.sendBookingCompletedEmail(payload);
          
          if (payload.tenantId) {
            await this.createNotification({
              tieuDe: 'Chuyến đi đã hoàn thành',
              noiDung: `Đơn đặt phòng của bạn cho căn hộ "${payload.apartmentTitle}" đã hoàn thành. Hy vọng bạn hài lòng với dịch vụ!`,
              nguoiNhanId: payload.tenantId,
              loai: NotificationType.BOOKING,
              nghiepVu: 'BOOKING',
              idDoiTuongLienQuan: payload.bookingId,
              urlDieuHuong: '/quan-ly/quan-ly-dat-phong',
            });
          }

          if (payload.ownerId) {
            await this.createNotification({
              tieuDe: 'Đơn đặt phòng hoàn thành',
              noiDung: `Đơn đặt phòng tại căn hộ "${payload.apartmentTitle}" đã hoàn thành.`,
              nguoiNhanId: payload.ownerId,
              loai: NotificationType.BOOKING,
              nghiepVu: 'BOOKING',
              idDoiTuongLienQuan: payload.bookingId,
              urlDieuHuong: '/quan-ly/quan-ly-dat-phong',
            });
          }
          break;

        case NotificationEventType.PAYMENT_SUCCESS:
          await this.emailService.sendPaymentSuccessEmail(payload);
          
          if (payload.tenantId) {
            await this.createNotification({
              tieuDe: 'Thanh toán thành công',
              noiDung: `Giao dịch thanh toán cho đơn đặt phòng tại căn hộ "${payload.apartmentTitle}" đã thành công.`,
              nguoiNhanId: payload.tenantId,
              loai: NotificationType.PAYMENT,
              nghiepVu: 'PAYMENT',
              idDoiTuongLienQuan: payload.bookingId,
              urlDieuHuong: '/quan-ly/quan-ly-dat-phong',
            });
          }

          if (payload.ownerId) {
            await this.createNotification({
              tieuDe: 'Khách hàng đã thanh toán',
              noiDung: `Khách hàng đã hoàn tất thanh toán cho đơn đặt phòng tại căn hộ "${payload.apartmentTitle}".`,
              nguoiNhanId: payload.ownerId,
              loai: NotificationType.PAYMENT,
              nghiepVu: 'PAYMENT',
              idDoiTuongLienQuan: payload.bookingId,
              urlDieuHuong: '/quan-ly/quan-ly-dat-phong',
            });
          }
          break;

        case NotificationEventType.PAYMENT_FAILED:
          await this.emailService.sendPaymentFailedEmail(payload);
          
          if (payload.tenantId) {
            await this.createNotification({
              tieuDe: 'Thanh toán thất bại',
              noiDung: `Giao dịch thanh toán cho đơn đặt phòng tại căn hộ "${payload.apartmentTitle}" đã thất bại. Vui lòng thử lại.`,
              nguoiNhanId: payload.tenantId,
              loai: NotificationType.PAYMENT,
              nghiepVu: 'PAYMENT',
              idDoiTuongLienQuan: payload.bookingId,
              urlDieuHuong: '/quan-ly/quan-ly-dat-phong',
            });
          }
          break;

        default:
          this.logger.warn(`Unhandled notification event type: ${event.eventType}`);
      }
    } catch (error) {
      this.logger.error(`Error saving notification to DB: ${error.message}`, error.stack);
    }
  }

  // --- CRUD APIs ---

  async createNotification(data: {
    tieuDe: string;
    noiDung: string;
    nguoiNhanId: string;
    loai?: NotificationType;
    nghiepVu?: string;
    idDoiTuongLienQuan?: string;
    urlDieuHuong?: string;
  }) {
    return this.prisma.notification.create({
      data: {
        tieuDe: data.tieuDe,
        noiDung: data.noiDung,
        nguoiNhanId: data.nguoiNhanId,
        loai: data.loai || NotificationType.SYSTEM,
        nghiepVu: data.nghiepVu,
        idDoiTuongLienQuan: data.idDoiTuongLienQuan,
        urlDieuHuong: data.urlDieuHuong,
      },
    });
  }

  async getNotifications(
    userId: string,
    opts: { page: number; pageSize: number; daXem?: boolean },
  ) {
    const where: any = { nguoiNhanId: userId };
    if (opts.daXem !== undefined) {
      where.daXem = opts.daXem;
    }

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { ngayTao: 'desc' },
        skip: (opts.page - 1) * opts.pageSize,
        take: opts.pageSize,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data,
      metaData: {
        page: opts.page,
        pageSize: opts.pageSize,
        total,
        totalPage: Math.ceil(total / opts.pageSize),
      },
    };
  }

  async countUnread(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { nguoiNhanId: userId, daXem: false },
    });
  }

  async markAsRead(id: number, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, nguoiNhanId: userId },
      data: { daXem: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { nguoiNhanId: userId, daXem: false },
      data: { daXem: true },
    });
  }

  async deleteMany(ids: number[], userId: string) {
    return this.prisma.notification.deleteMany({
      where: {
        id: { in: ids },
        nguoiNhanId: userId,
      },
    });
  }
}
