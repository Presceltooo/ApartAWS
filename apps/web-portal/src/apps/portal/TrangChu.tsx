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
import { useTranslation } from 'react-i18next';
import { useData } from './hooks/useData';
import { useActions } from './hooks/useActions';

const TrangChu: React.FC = () => {
  const { t } = useTranslation('portal');
  const navigate = useNavigate();
  const { residences } = useData();
  const { handleSearch } = useActions();

  const handleViewDetails = (id: number) => {
    navigate({ to: '/apartment/$id', params: { id: id.toString() } });
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'rare': return t('status_tags.rare', 'Lựa chọn hiếm');
      case 'popular': return t('status_tags.popular', 'Phổ biến');
      case 'available': return t('status_tags.available', 'Còn phòng');
      case 'verified': return t('status_tags.verified', 'Đã xác thực');
      case 'new': return t('status_tags.new', 'Mới');
      default: return status;
    }
  };

  return (
    <HomeWrapper>
      <HeroSection>
        <HeroTitle>
          {t('home.hero_title', 'Khám phá không gian sống sang trọng, ')}<span>{t('home.hero_title_highlight', 'đẳng cấp.')}</span>
        </HeroTitle>

        <HeroSearchBar>
          <SearchItem $border>
            <EnvironmentOutlined />
            <SearchLabel>
              <LabelText>{t('home.search.location', 'Địa điểm')}</LabelText>
              <ValueInput placeholder={t('home.search.location_placeholder', 'Bạn muốn đi đâu?')} />
            </SearchLabel>
          </SearchItem>

          <SearchItem $border>
            <CalendarOutlined />
            <SearchLabel>
              <LabelText>{t('home.search.check_in', 'Ngày nhận phòng')}</LabelText>
              <ValueInput type="text" placeholder={t('home.search.check_in_placeholder', 'Thêm ngày')} />
            </SearchLabel>
          </SearchItem>

          <SearchItem>
            <CalendarOutlined />
            <SearchLabel>
              <LabelText>{t('home.search.check_out', 'Ngày trả phòng')}</LabelText>
              <ValueInput type="text" placeholder={t('home.search.check_out_placeholder', 'Thêm ngày')} />
            </SearchLabel>
          </SearchItem>

          <SearchBtn onClick={handleSearch}>
            <SearchOutlined />
            {t('home.search.btn', 'Tìm kiếm')}
          </SearchBtn>
        </HeroSearchBar>
      </HeroSection>

      <GridSection>
        <SectionHeader>
          <SectionTitleWrapper>
            <h2>{t('home.featured.title', 'Căn hộ nổi bật')}</h2>
            <p>{t('home.featured.subtitle', 'Những căn hộ cao cấp được tuyển chọn kỹ lưỡng với tiện nghi vượt trội và kiến trúc độc đáo.')}</p>
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
                    {getStatusLabel(item.status)}
                  </StatusTag>
                  <ViewDetailsBtn>
                    {t('details.view_details', 'Xem chi tiết')}
                    <ArrowRightOutlined style={{fontSize: '1rem'}} />
                  </ViewDetailsBtn>
                </CardFooter>
              </CardContent>
            </ResidenceCard>
          ))}
        </ResidencesGrid>

        <div style={{marginTop: '4rem', textAlign: 'center'}}>
           <button className="px-10 py-4 rounded-xl border border-outline-variant/30 text-primary font-bold hover:bg-surface-container-low transition-colors" style={{background: 'transparent', cursor: 'pointer', borderRadius: '0.75rem', border: '1px solid rgba(133, 115, 110, 0.3)'}}>
             {t('home.featured.view_more', 'Xem thêm căn hộ')}
           </button>
        </div>
      </GridSection>

      <PromoSection>
        <PromoGrid>
          <RewardsCard>
            <h3>{t('home.promo.rewards_title', 'Phần thưởng độc quyền cho kỳ lưu trú dài ngày.')}</h3>
            <p>{t('home.promo.rewards_desc', 'Đặt phòng trên 30 ngày để nhận quyền truy cập vào Domin Concierge và các tiện ích phòng chờ cao cấp.')}</p>
            <button>{t('home.promo.learn_more', 'Tìm hiểu thêm')}</button>
            <div className="blob" />
          </RewardsCard>

          <VerifiedCard>
            <div>
              <SafetyCertificateOutlined style={{ fontSize: '2.5rem', marginBottom: '1.5rem', display: 'block' }} />
              <h3>{t('home.promo.verified_title', 'Xác thực Domin')}</h3>
              <p>{t('home.promo.verified_desc', 'Mọi căn hộ đều được đội ngũ kiến trúc của chúng tôi kiểm tra trực tiếp về tiêu chuẩn chất lượng và thiết kế.')}</p>
            </div>
            <div className="trust-label">{t('home.promo.trust_label', '100% Tin cậy.')}</div>
          </VerifiedCard>
        </PromoGrid>
      </PromoSection>
    </HomeWrapper>
  );
};

export default TrangChu;
