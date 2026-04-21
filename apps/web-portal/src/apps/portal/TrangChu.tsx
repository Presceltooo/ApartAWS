import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { 
  EnvironmentOutlined, 
  CalendarOutlined, 
  SearchOutlined, 
  ControlOutlined, 
  StarFilled, 
  ArrowRightOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import {
  HomeWrapper,
  HeroSection,
  HeroTitle,
  HeroSearchBar,
  SearchItem,
  SearchLabel,
  LabelText,
  ValueInput,
  SearchBtn,
  GridSection,
  SectionHeader,
  SectionTitleWrapper,
  ResidencesGrid,
  ResidenceCard,
  CardImgWrapper,
  CardImg,
  RatingBadge,
  CardContent,
  CardTitleRow,
  CardDesc,
  CardFooter,
  StatusTag,
  ViewDetailsBtn,
  PromoSection,
  PromoGrid,
  RewardsCard,
  VerifiedCard
} from './styles/styled';
import { useData } from './hooks/useData';
import { useActions } from './hooks/useActions';

const TrangChu: React.FC = () => {
  const navigate = useNavigate();
  const { residences } = useData();
  const { handleSearch } = useActions();

  const handleViewDetails = (id: number) => {
    navigate({ to: '/apartment/$id', params: { id: id.toString() } });
  };

  return (
    <HomeWrapper>
      <HeroSection>
        <HeroTitle>
          Discover luxury living, <span>reimagined.</span>
        </HeroTitle>

        <HeroSearchBar>
          <SearchItem $border>
            <EnvironmentOutlined />
            <SearchLabel>
              <LabelText>Location</LabelText>
              <ValueInput placeholder="Where are you going?" />
            </SearchLabel>
          </SearchItem>

          <SearchItem $border>
            <CalendarOutlined />
            <SearchLabel>
              <LabelText>Check-in Date</LabelText>
              <ValueInput type="text" placeholder="Add dates" />
            </SearchLabel>
          </SearchItem>

          <SearchItem>
            <CalendarOutlined />
            <SearchLabel>
              <LabelText>Check-out Date</LabelText>
              <ValueInput type="text" placeholder="Add dates" />
            </SearchLabel>
          </SearchItem>

          <SearchBtn onClick={handleSearch}>
            <SearchOutlined />
            Search
          </SearchBtn>
        </HeroSearchBar>
      </HeroSection>

      <GridSection>
        <SectionHeader>
          <SectionTitleWrapper>
            <h2>Featured Residences</h2>
            <p>Hand-picked premium apartments with exceptional amenities and architectural distinction.</p>
          </SectionTitleWrapper>
          <button className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors" style={{border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
            <ControlOutlined />
          </button>
        </SectionHeader>

        <ResidencesGrid>
          {residences.map(item => (
            <ResidenceCard key={item.id} onClick={() => handleViewDetails(item.id)}>
              <CardImgWrapper>
                <CardImg src={item.img} alt={item.title} />
                <RatingBadge>
                  <StarFilled className="star" />
                  {item.rating.toFixed(2)}
                </RatingBadge>
              </CardImgWrapper>
              
              <CardContent>
                <CardTitleRow>
                  <h3>{item.title}</h3>
                  <span>${item.price}/night</span>
                </CardTitleRow>

                <CardDesc>{item.desc}</CardDesc>

                <CardFooter>
                  <StatusTag $type={item.status as any}>
                    {item.status === 'rare' ? 'Rare Find' : item.status}
                  </StatusTag>
                  <ViewDetailsBtn>
                    View Details
                    <ArrowRightOutlined style={{fontSize: '1rem'}} />
                  </ViewDetailsBtn>
                </CardFooter>
              </CardContent>
            </ResidenceCard>
          ))}
        </ResidencesGrid>

        <div style={{marginTop: '4rem', textAlign: 'center'}}>
           <button className="px-10 py-4 rounded-xl border border-outline-variant/30 text-primary font-bold hover:bg-surface-container-low transition-colors" style={{background: 'transparent', cursor: 'pointer', borderRadius: '0.75rem', border: '1px solid rgba(133, 115, 110, 0.3)'}}>
             Load more residences
           </button>
        </div>
      </GridSection>

      <PromoSection>
        <PromoGrid>
          <RewardsCard>
            <h3>Exclusive rewards for long-term stays.</h3>
            <p>Book for more than 30 days and unlock access to the Aura Concierge and premium lounge facilities.</p>
            <button>Learn More</button>
            <div className="blob" />
          </RewardsCard>

          <VerifiedCard>
            <div>
              <SafetyCertificateOutlined style={{ fontSize: '2.5rem', marginBottom: '1.5rem', display: 'block' }} />
              <h3>Aura Verified</h3>
              <p>Every residence is hand-inspected by our architectural team for quality and design standards.</p>
            </div>
            <div className="trust-label">100% Trust.</div>
          </VerifiedCard>
        </PromoGrid>
      </PromoSection>
    </HomeWrapper>
  );
};

export default TrangChu;
