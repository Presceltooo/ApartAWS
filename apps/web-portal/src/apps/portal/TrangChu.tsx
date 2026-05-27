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
import { Skeleton, DatePicker } from 'antd';
import dayjs from 'dayjs';
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
  
  const {
    location,
    setLocation,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    searchParams,
    handleSearch
  } = useActions();

  const { residences, isLoading, isError } = useData({
    location: searchParams.location,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
  });

  const handleViewDetails = (id: string) => {
    navigate({ to: '/apartment/$id', params: { id } });
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
              <ValueInput 
                placeholder={t('home.search.location_placeholder', 'Bạn muốn đi đâu?')} 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </SearchLabel>
          </SearchItem>

          <SearchItem $border>
            <CalendarOutlined />
            <SearchLabel style={{ width: '100%' }}>
              <LabelText>{t('home.search.check_in', 'Ngày nhận phòng')}</LabelText>
              <DatePicker
                placeholder={t('home.search.check_in_placeholder', 'Thêm ngày')}
                value={checkIn ? dayjs(checkIn, 'YYYY-MM-DD') : null}
                onChange={(date) => setCheckIn(date ? date.format('YYYY-MM-DD') : '')}
                format="DD/MM/YYYY"
                disabledDate={(d) => d.isBefore(dayjs(), 'day')}
                variant="borderless"
                style={{
                  padding: 0,
                  fontSize: '1.6rem',
                  width: '100%',
                  color: '#4A1B0C',
                  fontWeight: 500,
                }}
                suffixIcon={null}
              />
            </SearchLabel>
          </SearchItem>

          <SearchItem>
            <CalendarOutlined />
            <SearchLabel style={{ width: '100%' }}>
              <LabelText>{t('home.search.check_out', 'Ngày trả phòng')}</LabelText>
              <DatePicker
                placeholder={t('home.search.check_out_placeholder', 'Thêm ngày')}
                value={checkOut ? dayjs(checkOut, 'YYYY-MM-DD') : null}
                onChange={(date) => setCheckOut(date ? date.format('YYYY-MM-DD') : '')}
                format="DD/MM/YYYY"
                disabledDate={(d) => {
                  if (checkIn) {
                    return d.isBefore(dayjs(checkIn, 'YYYY-MM-DD'), 'day');
                  }
                  return d.isBefore(dayjs(), 'day');
                }}
                variant="borderless"
                style={{
                  padding: 0,
                  fontSize: '1.6rem',
                  width: '100%',
                  color: '#4A1B0C',
                  fontWeight: 500,
                }}
                suffixIcon={null}
              />
            </SearchLabel>
          </SearchItem>

          <SearchBtn onClick={() => handleSearch()}>
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

        {isLoading ? (
          <ResidencesGrid>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ padding: '20px', background: 'rgba(255,255,255,0.4)', borderRadius: '12px' }}>
                <Skeleton active paragraph={{ rows: 4 }} />
              </div>
            ))}
          </ResidencesGrid>
        ) : isError ? (
          <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '1.6rem', color: '#712B13' }}>
            {t('home.load_error', 'Không thể tải danh sách căn hộ. Vui lòng thử lại.')}
          </div>
        ) : residences.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '1.6rem', color: '#8C7169' }}>
            {t('home.empty_residences', 'Không tìm thấy căn hộ phù hợp với tìm kiếm của bạn.')}
          </div>
        ) : (
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
        )}

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
