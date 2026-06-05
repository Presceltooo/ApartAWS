import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  SafetyCertificateOutlined, 
  TeamOutlined, 
  CompassOutlined, 
  HeartOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import {
  AboutWrapper,
  BackLink,
  HeroSection,
  HeroTitle,
  HeroSubtitle,
  EditorialSection,
  ImageContainer,
  EditorialContent,
  SectionLabel,
  SectionHeading,
  Paragraph,
  ValuesSection,
  ValuesHeader,
  ValuesGrid,
  ValueCard,
  ValueIcon,
  ValueTitle,
  ValueDesc,
  StatsSection,
  StatBox,
  StatNumber,
  StatLabel,
  PhilosophySection,
  PhilosophyContent,
  PhilosophyBadge,
  PhilosophyVisual
} from './styles/styled';

const About: React.FC = () => {
  const { t } = useTranslation('portal');

  return (
    <AboutWrapper>
      {/* Back to Home Button */}
      <BackLink to="/">
        <ArrowLeftOutlined />
        {t('list.back_to_home', 'Quay lại trang chủ')}
      </BackLink>

      {/* Premium Hero Banner */}
      <HeroSection>
        <HeroTitle>
          {t('about.hero_title', 'Kiến tạo không gian, nâng tầm ')}
          <span>{t('about.hero_title_highlight', 'trải nghiệm sống.')}</span>
        </HeroTitle>
        <HeroSubtitle>
          {t('about.story_subtitle', 'Đồng hành cùng bạn trên hành trình tìm kiếm những không gian sống đầy cảm hứng.')}
        </HeroSubtitle>
      </HeroSection>

      {/* Editorial Brand Story Section */}
      <EditorialSection>
        <ImageContainer>
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80" 
            alt="Domin Tactic Premium Architecture" 
          />
        </ImageContainer>
        <EditorialContent>
          <SectionLabel>{t('about.story_title', 'Câu chuyện của chúng tôi')}</SectionLabel>
          <SectionHeading>
            {t('about.story_title', 'Câu chuyện của chúng tôi')}
          </SectionHeading>
          <Paragraph>
            {t('about.story_text_1', 'Khởi đầu từ khát vọng định nghĩa lại tiêu chuẩn lưu trú cao cấp, Domin Tactic không chỉ cung cấp những căn hộ tiện nghi mà còn kiến tạo một hệ sinh thái sống thượng lưu, nơi mỗi chi tiết nhỏ nhất đều được chăm chút kỹ lưỡng bởi đội ngũ kiến trúc sư hàng đầu.')}
          </Paragraph>
          <Paragraph>
            {t('about.story_text_2', 'Chúng tôi tin rằng một không gian sống hoàn hảo phải là sự kết hợp hài hòa giữa thiết kế tinh tế, công nghệ hiện đại và dịch vụ tận tâm. Domin Tactic tự hào đồng hành cùng hàng ngàn khách thuê và chủ căn hộ trong việc xây dựng những tổ ấm đích thực.')}
          </Paragraph>
        </EditorialContent>
      </EditorialSection>

      {/* Stat Metrics Section */}
      <StatsSection>
        <StatBox>
          <StatNumber>{t('about.stat_1_val', '50+')}</StatNumber>
          <StatLabel>{t('about.stat_1_label', 'Căn hộ cao cấp')}</StatLabel>
        </StatBox>
        <StatBox>
          <StatNumber>{t('about.stat_2_val', '1.200+')}</StatNumber>
          <StatLabel>{t('about.stat_2_label', 'Chuyến đi trọn vẹn')}</StatLabel>
        </StatBox>
        <StatBox>
          <StatNumber>{t('about.stat_3_val', '4.9/5')}</StatNumber>
          <StatLabel>{t('about.stat_3_label', 'Đánh giá hài lòng')}</StatLabel>
        </StatBox>
      </StatsSection>

      {/* Core Values Section */}
      <ValuesSection>
        <ValuesHeader>
          <SectionLabel>{t('about.values_title', 'Giá trị cốt lõi')}</SectionLabel>
          <SectionHeading>{t('about.values_title', 'Giá trị cốt lõi')}</SectionHeading>
          <Paragraph>
            {t('about.values_subtitle', 'Những nguyên tắc dẫn lối cho mọi hoạt động và thiết kế của Domin Tactic.')}
          </Paragraph>
        </ValuesHeader>
        
        <ValuesGrid>
          <ValueCard>
            <ValueIcon>
              <SafetyCertificateOutlined />
            </ValueIcon>
            <ValueTitle>{t('about.value_1_title', 'Uy tín hàng đầu')}</ValueTitle>
            <ValueDesc>
              {t('about.value_1_desc', 'Mọi thông tin căn hộ, trạng thái đặt phòng đều được minh bạch và xác thực 100% bởi đội ngũ Domin.')}
            </ValueDesc>
          </ValueCard>

          <ValueCard>
            <ValueIcon>
              <CompassOutlined />
            </ValueIcon>
            <ValueTitle>{t('about.value_2_title', 'Thiết kế tinh tế')}</ValueTitle>
            <ValueDesc>
              {t('about.value_2_desc', 'Loại bỏ những chi tiết rườm rà, tập trung vào sự tối giản, tối ưu không gian và ánh sáng tự nhiên.')}
            </ValueDesc>
          </ValueCard>

          <ValueCard>
            <ValueIcon>
              <TeamOutlined />
            </ValueIcon>
            <ValueTitle>{t('about.value_3_title', 'Dịch vụ tận tâm')}</ValueTitle>
            <ValueDesc>
              {t('about.value_3_desc', 'Đội ngũ quản gia Domin Concierge luôn sẵn sàng hỗ trợ bạn 24/7 với tinh thần phục vụ chuyên nghiệp nhất.')}
            </ValueDesc>
          </ValueCard>

          <ValueCard>
            <ValueIcon>
              <HeartOutlined />
            </ValueIcon>
            <ValueTitle>{t('about.value_4_title', 'Cá nhân hóa')}</ValueTitle>
            <ValueDesc>
              {t('about.value_4_desc', 'Mỗi không gian sống đều được tùy chỉnh linh hoạt nhằm mang lại sự thoải mái và phù hợp nhất cho bạn.')}
            </ValueDesc>
          </ValueCard>
        </ValuesGrid>
      </ValuesSection>

      {/* Architectural Philosophy Section */}
      <PhilosophySection>
        <PhilosophyContent>
          <PhilosophyBadge>
            {t('about.philosophy_badge', 'Triết lý') || 'Triết lý'}
          </PhilosophyBadge>
          <SectionHeading>
            {t('about.philosophy_title', 'Triết lý kiến trúc "Clean White"')}
          </SectionHeading>
          <Paragraph>
            {t('about.philosophy_desc', 'Chúng tôi áp dụng quy tắc nghiêm ngặt \'Không đường kẻ\' trong thiết kế giao diện và không gian thực tế. Sự phân chia ranh giới được tạo nên bởi sự chuyển dịch của sắc độ màu sắc và ánh sáng, mang lại cảm giác dễ chịu, liền mạch và sang trọng vượt thời gian.')}
          </Paragraph>
        </PhilosophyContent>
        <PhilosophyVisual />
      </PhilosophySection>
    </AboutWrapper>
  );
};

export default About;
