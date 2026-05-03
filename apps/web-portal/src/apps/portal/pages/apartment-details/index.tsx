import React from 'react';
import { Link } from '@tanstack/react-router';
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
        <p>Unable to load property details. <Link to="/can-ho">Browse all properties</Link></p>
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
            Back to Collection
          </BackLink>
          <StatusBadge>
            <StarFilled className="star" />
            Aura Verified
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
                  <BentoLabel>Price per Night</BentoLabel>
                  <BentoValue>${pricePerNight.toLocaleString()}</BentoValue>
                </div>
                <CalendarOutlined style={{ fontSize: '1.875rem', color: 'rgba(153,60,29,0.2)' }} />
              </BentoBox>

              <BentoBox>
                <BentoLabel>Status</BentoLabel>
                <BentoValue>
                  <Tag color={apartment.isActive ? 'success' : 'default'}>
                    {apartment.isActive ? 'Available' : 'Unavailable'}
                  </Tag>
                </BentoValue>
              </BentoBox>

              <BentoBox>
                <BentoLabel>Category</BentoLabel>
                <BentoValue>
                  <HomeOutlined style={{ marginRight: 6 }} />
                  Apartment
                </BentoValue>
              </BentoBox>
            </BentoGrid>

            {/* Description */}
            {apartment.description && (
              <div>
                <SectionTitle>The Architecture</SectionTitle>
                <SectionText>{apartment.description}</SectionText>
              </div>
            )}

            {/* Amenities */}
            {apartment.amenities?.length > 0 && (
              <div>
                <SectionTitle>Signatures</SectionTitle>
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
              <SectionTitle>Location</SectionTitle>
              <MapWrapper>
                <div className="pin-wrapper">
                  <div className="pin-circle">
                    <HomeOutlined />
                  </div>
                </div>
              </MapWrapper>
              <MapDisclaimer>
                {apartment.location} — Exact address provided after booking.
              </MapDisclaimer>
            </div>
          </LeftColumn>

          <RightColumn>
            <StickyWidgetContainer>
              <WidgetTitle>Reservation</WidgetTitle>

              <SummaryRow>
                <span>Price per night</span>
                <span className="price">${pricePerNight.toLocaleString()}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Cleaning fee</span>
                <span className="price">$120</span>
              </SummaryRow>
              <SummaryRow>
                <span>Service fee</span>
                <span className="price">$85</span>
              </SummaryRow>

              <SummaryRow $isTotal>
                <span>Starting from</span>
                <span className="price">${(pricePerNight + 205).toLocaleString()}</span>
              </SummaryRow>

              <PaymentSuccessCard>
                <LockOutlined />
                <div>
                  <p className="title">Secure Reserve</p>
                  <p className="desc">No charge until confirmed.</p>
                </div>
              </PaymentSuccessCard>

              <WidgetPrimaryBtn
                id={`book-apartment-${apartment.id}`}
                onClick={openModal}
                disabled={!apartment.isActive}
              >
                {apartment.isActive ? 'Initialize Booking' : 'Not Available'}
                {apartment.isActive && <ArrowRightOutlined />}
              </WidgetPrimaryBtn>

              <WidgetSecondaryBtn onClick={() => window.history.back()}>
                Back to Collection
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
