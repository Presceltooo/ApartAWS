import React from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
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
  const pricePerNight = apartment.pricePerNight;

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
              <MapWrapper>
                <div className="pin-wrapper">
                  <div className="pin-circle">
                    <HomeOutlined />
                  </div>
                </div>
              </MapWrapper>
              <MapDisclaimer>
                {apartment.location} — {t('details.location_disclaimer', 'Địa chỉ chính xác sẽ được cung cấp sau khi đặt phòng.')}
              </MapDisclaimer>
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
                <span className="price">120.000 ₫</span>
              </SummaryRow>
              <SummaryRow>
                <span>{t('details.book_widget.service_fee', 'Phí dịch vụ')}</span>
                <span className="price">85.000 ₫</span>
              </SummaryRow>
 
              <SummaryRow $isTotal>
                <span>{t('details.book_widget.total_from', 'Tổng cộng từ')}</span>
                <span className="price">{(pricePerNight + 205000).toLocaleString('vi-VN')} ₫</span>
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
      />
    </>
  );
};

export default ApartmentDetails;
