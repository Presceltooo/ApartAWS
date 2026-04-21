import React from 'react';
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
  FireOutlined,
  CoffeeOutlined,
  AppstoreOutlined,
  SmileOutlined
} from '@ant-design/icons';
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
  BentoBoxGroupFlex,
  BentoLabel,
  BentoValue,
  BentoSubValue,
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

const ApartmentDetails: React.FC = () => {
  const { apartment, isLoading } = useData();
  const { modalOpen, openModal, closeModal } = useActions();

  if (isLoading) {
    return <div>Gathering details...</div>;
  }

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
          <HeroImage src={apartment.imageUrl} alt={apartment.title} />
          <LocationFloatBadge>
            <EnvironmentOutlined />
            <span>{apartment.location}</span>
          </LocationFloatBadge>
        </HeroImageWrapper>
      </DetailSection>

      <DetailSection>
        <ContentGrid>
          <LeftColumn>
            <BentoGrid>
              <BentoBoxGroupFlex $colSpan={2}>
                <div>
                  <BentoLabel>Curated Dates</BentoLabel>
                  <BentoValue>Oct 12 — Oct 26</BentoValue>
                  <BentoSubValue>14 Nights</BentoSubValue>
                </div>
                <CalendarOutlined />
              </BentoBoxGroupFlex>

              <BentoBox>
                <BentoLabel>Guests</BentoLabel>
                <BentoValue>2 Guests</BentoValue>
              </BentoBox>

              <BentoBox>
                <BentoLabel>Configuration</BentoLabel>
                <BentoValue>1 Bed, 1.5 Bath</BentoValue>
              </BentoBox>
            </BentoGrid>

            <div>
              <SectionTitle>The Architecture</SectionTitle>
              <SectionText>
                Suspended above the valley floor, this transparent pavilion blurs the boundaries between shelter and nature. Meticulously engineered structural glass walls disappear into the canopy, while rough-hewn concrete anchors the structure to the hillside. The interiors feature curated mid-century pieces set against a backdrop of ancient oaks.
              </SectionText>
              <SectionText>
                Every element has been considered—from the placement of the morning sun across the terrazzo floors to the acoustic dampening of the cedar ceilings.
              </SectionText>
            </div>

            <div>
              <SectionTitle>Signatures</SectionTitle>
              <AmenitiesChipsRow>
                <AmenityChip $highlight>
                  <SmileOutlined /> Private Trail Access
                </AmenityChip>
                <AmenityChip $highlight>
                  <SmileOutlined /> Cedar Soaking Tub
                </AmenityChip>
                <AmenityChip>
                  <WifiOutlined /> High-Speed Fiber
                </AmenityChip>
                <AmenityChip>
                  <AppstoreOutlined /> Chef's Kitchen
                </AmenityChip>
                <AmenityChip>
                  <FireOutlined /> Floating Hearth
                </AmenityChip>
                <AmenityChip>
                  <CoffeeOutlined /> Wine Fridge
                </AmenityChip>
              </AmenitiesChipsRow>
            </div>

            <div>
              <SectionTitle>Location</SectionTitle>
              <MapWrapper>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3_JszN5T_lQnQn7P0W0Zf2sDkPnvwS2jE5B5Z_Z1wKqR2fPZ_P9kR45Z-R_vT8nK51fH0M-bX1rIuR_V_W4iZ1vMmMz7R_v2J0g0Oa8Wq6Fh5vJvM7wN_1M7nN8wN2aC82gG02g0wW_1v9Z5kK1o_2J0wB8iW4iW3Q-T5aI7W_e0G2jQ_lJ30D3yV40_wV_C6oI9V84" alt="Map Location" /> 
                <div className="pin-wrapper">
                  <div className="pin-circle">
                     <HomeOutlined />
                  </div>
                </div>
              </MapWrapper>
              <MapDisclaimer>Exact location provided post-booking to preserve the privacy of the sanctuary.</MapDisclaimer>
            </div>
          </LeftColumn>

          <RightColumn>
            <StickyWidgetContainer>
              <WidgetTitle>Reservation</WidgetTitle>
              
              <SummaryRow>
                <span>${apartment.price} × 14 nights</span>
                <span className="price">${(apartment.price * 14).toLocaleString()}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Curator Fee</span>
                <span className="price">$250</span>
              </SummaryRow>
              <SummaryRow>
                <span>Taxes & Local Fees</span>
                <span className="price">$850</span>
              </SummaryRow>
              
              <SummaryRow $isTotal>
                <span>Total (USD)</span>
                <span className="price">${((apartment.price * 14) + 250 + 850).toLocaleString()}</span>
              </SummaryRow>

              <PaymentSuccessCard>
                <LockOutlined />
                <div>
                  <p className="title">Secure Reserve</p>
                  <p className="desc">Your reservation will be held securely. No charge until confirmed.</p>
                </div>
              </PaymentSuccessCard>

              <WidgetPrimaryBtn onClick={openModal}>
                Initialize Booking
                <ArrowRightOutlined />
              </WidgetPrimaryBtn>

              <WidgetSecondaryBtn>
                Contact Concierge
              </WidgetSecondaryBtn>
            </StickyWidgetContainer>
          </RightColumn>
        </ContentGrid>
      </DetailSection>

      <BookingModal 
        open={modalOpen} 
        onClose={closeModal} 
        propertyName={apartment.title} 
        pricePerNight={apartment.price} 
      />
    </>
  );
};

export default ApartmentDetails;
