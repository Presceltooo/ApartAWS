import React from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import BookingModal from './modals/BookingModal';
import {
  ArrowLeftOutlined,
  StarFilled,
  EnvironmentOutlined,
  CalendarOutlined,
  HomeOutlined,
  LockOutlined,
  ArrowRightOutlined,
  WifiOutlined,
  AppstoreOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Skeleton, Tag } from 'antd';
import { LocationMap } from '@/shared/components/map';
import {
  DetailSection,
  TopBarWrapper,
  BackLink,
  StatusBadge,
  PropertyTitle,
  HeroImageWrapper,
  HeroImage,
  LocationFloatBadge,
  ContentGrid,
  LeftColumn,
  RightColumn,
  BentoGrid,
  BentoBox,
  BentoLabel,
  BentoValue,
  SectionTitle,
  SectionText,
  AmenitiesChipsRow,
  AmenityChip,
  MapWrapper,
  MapDisclaimer,
  StickyWidgetContainer,
  WidgetTitle,
  SummaryRow,
  PaymentSuccessCard,
  WidgetPrimaryBtn,
  WidgetSecondaryBtn,
} from './styles/styled';
import { useData } from './hooks/useData';
import { useActions } from './hooks/useActions';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80',
];

const ApartmentDetails: React.FC = () => {
  const { t } = useTranslation('portal');
  const { apartment, isLoading, isError } = useData();
  const { modalOpen, openModal, closeModal } = useActions();

  if (isLoading) {
    return (
      <DetailSection style={{ padding: '2rem' }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </DetailSection>
    );
  }

  if (isError || !apartment) {
    return (
      <DetailSection style={{ padding: '2rem', textAlign: 'center' }}>
        <p>{t('details.load_error', 'Không thể tải thông tin căn hộ.')} <Link to="/can-ho">{t('details.view_list', 'Xem danh sách căn hộ')}</Link></p>
      </DetailSection>
    );
  }

  const imageUrl = apartment.images?.[0] ?? FALLBACK_IMAGES[0];
  const pricePerNight = Number(apartment.pricePerNight);

  return (
    <>
      <DetailSection>
        <TopBarWrapper>
          <BackLink onClick={() => window.history.back()}>
            <ArrowLeftOutlined />
            {t('details.back_to_list', 'Quay lại danh sách')}
          </BackLink>
          <StatusBadge>
            <StarFilled className="star" />
            {t('details.verified', 'Xác thực Domin')}
          </StatusBadge>
        </TopBarWrapper>
 
        <PropertyTitle>{apartment.title}</PropertyTitle>
 
        <HeroImageWrapper>
          <HeroImage
            src={imageUrl}
            alt={apartment.title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGES[0];
            }}
          />
          <LocationFloatBadge>
            <EnvironmentOutlined />
            <span>{apartment.location}</span>
          </LocationFloatBadge>
        </HeroImageWrapper>
      </DetailSection>
 
      <DetailSection>
        <ContentGrid>
          <LeftColumn>
            {/* Quick info bento */}
            <BentoGrid>
              <BentoBox $colSpan={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <BentoLabel>{t('details.price_per_night', 'Giá mỗi đêm')}</BentoLabel>
                  <BentoValue>{pricePerNight.toLocaleString('vi-VN')} ₫</BentoValue>
                </div>
                <CalendarOutlined style={{ fontSize: '1.875rem', color: 'rgba(153,60,29,0.2)' }} />
              </BentoBox>
 
              <BentoBox>
                <BentoLabel>{t('details.status', 'Trạng thái')}</BentoLabel>
                <BentoValue>
                  <Tag color={apartment.isActive ? 'success' : 'default'}>
                    {apartment.isActive ? t('details.available', 'Còn phòng') : t('details.unavailable', 'Hết phòng')}
                  </Tag>
                </BentoValue>
              </BentoBox>
 
              <BentoBox>
                <BentoLabel>{t('details.category', 'Hạng mục')}</BentoLabel>
                <BentoValue>
                  <HomeOutlined style={{ marginRight: 6 }} />
                  {t('details.apartment', 'Căn hộ')}
                </BentoValue>
              </BentoBox>
            </BentoGrid>
 
            {/* Description */}
            {apartment.description && (
              <div>
                <SectionTitle>{t('details.architecture_space', 'Kiến trúc & Không gian')}</SectionTitle>
                <SectionText>{apartment.description}</SectionText>
              </div>
            )}
 
            {/* Amenities */}
            {apartment.amenities?.length > 0 && (
              <div>
                <SectionTitle>{t('details.featured_amenities', 'Tiện ích nổi bật')}</SectionTitle>
                <AmenitiesChipsRow>
                  {apartment.amenities.map((am, i) => (
                    <AmenityChip key={am} $highlight={i < 2}>
                      {i === 0 ? <SmileOutlined /> : i === 1 ? <WifiOutlined /> : <AppstoreOutlined />}
                      {am}
                    </AmenityChip>
                  ))}
                </AmenitiesChipsRow>
              </div>
            )}
 
            {/* Location */}
            <div>
              <SectionTitle>{t('details.location', 'Vị trí')}</SectionTitle>
              {apartment.latitude && apartment.longitude ? (
                <LocationMap
                  latitude={apartment.latitude}
                  longitude={apartment.longitude}
                  height="300px"
                />
              ) : (
                <MapWrapper>
                  <div className="pin-wrapper">
                    <div className="pin-circle">
                      <HomeOutlined />
                    </div>
                  </div>
                </MapWrapper>
              )}
              <MapDisclaimer>
                {apartment.location} — {t('details.location_disclaimer', 'Địa chỉ chính xác sẽ được cung cấp sau khi đặt phòng.')}
              </MapDisclaimer>
            </div>

            {/* Reviews Section */}
            <div style={{ marginTop: '2.5rem' }}>
              <SectionTitle style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {t('details.reviews', 'Đánh giá từ khách thuê')}
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#D85A30', background: 'rgba(216,90,48,0.08)', padding: '2px 8px', borderRadius: '4px' }}>
                  {apartment.averageRating !== undefined && apartment.averageRating !== null ? (
                    <>★ {Number(apartment.averageRating).toFixed(1)} ({apartment.reviewCount ?? 0})</>
                  ) : (
                    t('details.new_rating', 'Mới')
                  )}
                </span>
              </SectionTitle>
              
              {apartment.reviews && apartment.reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                  {apartment.reviews.map((rev: any) => (
                    <div key={rev.id} style={{ background: '#fcf9f4', border: '1px solid rgba(224, 192, 182, 0.15)', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(74, 27, 12, 0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.45rem', color: '#4A1B0C' }}>{rev.tenantName}</span>
                        <span style={{ fontSize: '1.2rem', color: '#888' }}>
                          {dayjs(rev.createdAt).format('DD/MM/YYYY')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.8rem' }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarFilled key={i} style={{ color: i < rev.rating ? '#D85A30' : '#e0e0e0', fontSize: '1.3rem' }} />
                        ))}
                      </div>
                      {rev.comment && (
                        <p style={{ margin: 0, fontSize: '1.35rem', color: '#6B3020', lineHeight: 1.5, fontStyle: 'italic' }}>
                          "{rev.comment}"
                        </p>
                      )}
                      {rev.reply && (
                        <div
                          style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            backgroundColor: '#f6f3ee',
                            borderRadius: '6px',
                            borderLeft: '4px solid #a5360d',
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: '1.25rem', color: '#a5360d', marginBottom: '4px' }}>
                            {t('booking_detail.review.owner_reply', 'Chủ nhà phản hồi')}:
                          </div>
                          <div style={{ color: '#595959', fontSize: '1.25rem', lineHeight: 1.4 }}>
                            {rev.reply}
                          </div>
                          {rev.repliedAt && (
                            <div style={{ fontSize: '1.1rem', color: '#8c8c8c', marginTop: '4px' }}>
                              {dayjs(rev.repliedAt).format('DD/MM/YYYY HH:mm')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#888', fontSize: '1.35rem', fontStyle: 'italic', marginTop: '1rem' }}>
                  {t('details.no_reviews', 'Căn hộ này chưa có đánh giá nào.')}
                </p>
              )}
            </div>
          </LeftColumn>
 
          <RightColumn>
            <StickyWidgetContainer>
              <WidgetTitle>{t('details.book_widget.title', 'Đặt phòng')}</WidgetTitle>
 
              <SummaryRow>
                <span>{t('details.book_widget.price_per_night', 'Giá mỗi đêm')}</span>
                <span className="price">{pricePerNight.toLocaleString('vi-VN')} ₫</span>
              </SummaryRow>
              <SummaryRow>
                <span>{t('details.book_widget.cleaning_fee', 'Phí vệ sinh')}</span>
                <span className="price">{Number(apartment.cleaningFee ?? 120000).toLocaleString('vi-VN')} ₫</span>
              </SummaryRow>
              <SummaryRow>
                <span>{t('details.book_widget.service_fee', 'Phí dịch vụ')}</span>
                <span className="price">{Number(apartment.serviceFee ?? 85000).toLocaleString('vi-VN')} ₫</span>
              </SummaryRow>
 
              <SummaryRow $isTotal>
                <span>{t('details.book_widget.total_from', 'Tổng cộng từ')}</span>
                <span className="price">{(pricePerNight + Number(apartment.cleaningFee ?? 120000) + Number(apartment.serviceFee ?? 85000)).toLocaleString('vi-VN')} ₫</span>
              </SummaryRow>
 
              <PaymentSuccessCard>
                <LockOutlined />
                <div>
                  <p className="title">{t('details.book_widget.secure_booking', 'Đặt phòng an toàn')}</p>
                  <p className="desc">{t('details.book_widget.secure_booking_desc', 'Không thu phí cho đến khi được xác nhận.')}</p>
                </div>
              </PaymentSuccessCard>
 
              <WidgetPrimaryBtn
                id={`book-apartment-${apartment.id}`}
                onClick={openModal}
                disabled={!apartment.isActive}
              >
                {apartment.isActive ? t('details.book_widget.proceed_btn', 'Tiến hành đặt phòng') : t('details.book_widget.unavailable_btn', 'Hiện không khả dụng')}
                {apartment.isActive && <ArrowRightOutlined />}
              </WidgetPrimaryBtn>
 
              <WidgetSecondaryBtn onClick={() => window.history.back()}>
                {t('details.back_to_list', 'Quay lại danh sách')}
              </WidgetSecondaryBtn>
            </StickyWidgetContainer>
          </RightColumn>
        </ContentGrid>
      </DetailSection>
 
      <BookingModal
        open={modalOpen}
        onClose={closeModal}
        apartmentId={apartment.id}
        propertyName={apartment.title}
        pricePerNight={pricePerNight}
        cleaningFee={Number(apartment.cleaningFee ?? 120000)}
        serviceFee={Number(apartment.serviceFee ?? 85000)}
        maxGuests={Number(apartment.maxGuests ?? 2)}
      />
    </>
  );
};

export default ApartmentDetails;
