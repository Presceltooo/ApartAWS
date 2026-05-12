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
          Khám phá không gian sống sang trọng, <span>đẳng cấp.</span>
        </HeroTitle>

        <HeroSearchBar>
          <SearchItem $border>
            <EnvironmentOutlined />
            <SearchLabel>
              <LabelText>Địa điểm</LabelText>
              <ValueInput placeholder="Bạn muốn đi đâu?" />
            </SearchLabel>
          </SearchItem>

          <SearchItem $border>
            <CalendarOutlined />
            <SearchLabel>
              <LabelText>Ngày nhận phòng</LabelText>
              <ValueInput type="text" placeholder="Thêm ngày" />
            </SearchLabel>
          </SearchItem>

          <SearchItem>
            <CalendarOutlined />
            <SearchLabel>
              <LabelText>Ngày trả phòng</LabelText>
              <ValueInput type="text" placeholder="Thêm ngày" />
            </SearchLabel>
          </SearchItem>

          <SearchBtn onClick={handleSearch}>
            <SearchOutlined />
            Tìm kiếm
          </SearchBtn>
        </HeroSearchBar>
      </HeroSection>

      <GridSection>
        <SectionHeader>
          <SectionTitleWrapper>
            <h2>Căn hộ nổi bật</h2>
            <p>Những căn hộ cao cấp được tuyển chọn kỹ lưỡng với tiện nghi vượt trội và kiến trúc độc đáo.</p>
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
                  <span>{item.price.toLocaleString('vi-VN')} ₫/đêm</span>
                </CardTitleRow>

                <CardDesc>{item.desc}</CardDesc>

                <CardFooter>
                  <StatusTag $type={item.status as any}>
                    {item.status === 'rare' ? 'Lựa chọn hiếm' : (item.status === 'popular' ? 'Phổ biến' : item.status)}
                  </StatusTag>
                  <ViewDetailsBtn>
                    Xem chi tiết
                    <ArrowRightOutlined style={{fontSize: '1rem'}} />
                  </ViewDetailsBtn>
                </CardFooter>
              </CardContent>
            </ResidenceCard>
          ))}
        </ResidencesGrid>

        <div style={{marginTop: '4rem', textAlign: 'center'}}>
           <button className="px-10 py-4 rounded-xl border border-outline-variant/30 text-primary font-bold hover:bg-surface-container-low transition-colors" style={{background: 'transparent', cursor: 'pointer', borderRadius: '0.75rem', border: '1px solid rgba(133, 115, 110, 0.3)'}}>
             Xem thêm căn hộ
           </button>
        </div>
      </GridSection>

      <PromoSection>
        <PromoGrid>
          <RewardsCard>
            <h3>Phần thưởng độc quyền cho kỳ lưu trú dài ngày.</h3>
            <p>Đặt phòng trên 30 ngày để nhận quyền truy cập vào Domin Concierge và các tiện ích phòng chờ cao cấp.</p>
            <button>Tìm hiểu thêm</button>
            <div className="blob" />
          </RewardsCard>

          <VerifiedCard>
            <div>
              <SafetyCertificateOutlined style={{ fontSize: '2.5rem', marginBottom: '1.5rem', display: 'block' }} />
              <h3>Xác thực Domin</h3>
              <p>Mọi căn hộ đều được đội ngũ kiến trúc của chúng tôi kiểm tra trực tiếp về tiêu chuẩn chất lượng và thiết kế.</p>
            </div>
            <div className="trust-label">100% Tin cậy.</div>
          </VerifiedCard>
        </PromoGrid>
      </PromoSection>
    </HomeWrapper>
  );
};

export default TrangChu;
