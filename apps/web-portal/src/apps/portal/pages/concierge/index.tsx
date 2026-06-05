import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Select, Result } from 'antd';
import { 
  CarOutlined, 
  UserOutlined, 
  CoffeeOutlined, 
  HeartOutlined, 
  ClearOutlined, 
  CompassOutlined,
  ArrowLeftOutlined,
  SendOutlined,
  PhoneOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { portalTheme } from '../../styled';
import { useNotification } from '../../../../shared/hooks/useNotification';
import {
  ConciergeWrapper,
  BackLink,
  HeroSection,
  HeroTitle,
  HeroSubtitle,
  IntroSection,
  SectionLabel,
  SectionHeading,
  Paragraph,
  ServicesGrid,
  ServiceCard,
  CardHeaderRow,
  ServiceIcon,
  ServiceBadge,
  ServiceTitle,
  ServiceDesc,
  ServiceMeta,
  RequestSection,
  RequestInfo,
  FormCard,
  FormTitle,
  SubmitButton
} from './styles/styled';

const { Option } = Select;
const { TextArea } = Input;

const Concierge: React.FC = () => {
  const { t } = useTranslation('portal');
  const [form] = Form.useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showInfoNotify } = useNotification();

  const handleCardClick = (serviceTitle: string) => {
    showInfoNotify(
      t('services.coming_soon_title', 'Tính năng đang phát triển'),
      t('services.coming_soon_desc', 'Dịch vụ {{service}} hiện đang trong quá trình phát triển. Vui lòng liên hệ hotline hoặc sử dụng form bên dưới để được hỗ trợ.', { service: serviceTitle }),
    );
  };

  const servicesList = [
    {
      id: 'airport',
      icon: <CarOutlined />,
      title: t('services.list.item_1_title', 'Đưa đón sân bay cao cấp'),
      desc: t('services.list.item_1_desc', 'Dịch vụ xe riêng đưa đón hai chiều sang trọng từ sân bay về căn hộ của bạn, lái xe chuyên nghiệp và chu đáo.'),
      meta: t('services.list.item_1_meta', 'Đặt trước 24 giờ'),
      badge: t('services.badge_booking', 'Đặt trước') || 'Đặt trước'
    },
    {
      id: 'butler',
      icon: <UserOutlined />,
      title: t('services.list.item_2_title', 'Quản gia riêng 24/7'),
      desc: t('services.list.item_2_desc', 'Quản gia chuyên nghiệp hỗ trợ mọi nhu cầu từ đặt lịch ăn uống, mua sắm nhu yếu phẩm đến giải quyết các vấn đề lưu trú.'),
      meta: t('services.list.item_2_meta', 'Dịch vụ trọn gói'),
      badge: t('services.badge_vip', 'Cao cấp') || 'Cao cấp'
    },
    {
      id: 'chef',
      icon: <CoffeeOutlined />,
      title: t('services.list.item_3_title', 'Đầu bếp riêng tại phòng'),
      desc: t('services.list.item_3_desc', 'Thưởng thức những bữa tiệc ẩm thực đẳng cấp được chế biến trực tiếp tại căn hộ của bạn bởi các đầu bếp hàng đầu.'),
      meta: t('services.list.item_3_meta', 'Đặt trước 12 giờ'),
      badge: t('services.badge_booking', 'Đặt trước') || 'Đặt trước'
    },
    {
      id: 'spa',
      icon: <HeartOutlined />,
      title: t('services.list.item_4_title', 'Spa & Trị liệu tại gia'),
      desc: t('services.list.item_4_desc', 'Thư giãn tâm trí và cơ thể với liệu trình chăm sóc sức khỏe, massage chuyên sâu ngay trong không gian riêng tư của căn hộ.'),
      meta: t('services.list.item_4_meta', 'Dịch vụ theo lịch đặt'),
      badge: t('services.badge_relax', 'Trị liệu') || 'Trị liệu'
    },
    {
      id: 'housekeeping',
      icon: <ClearOutlined />,
      title: t('services.list.item_5_title', 'Dọn phòng hàng ngày'),
      desc: t('services.list.item_5_desc', 'Đảm bảo căn hộ của bạn luôn trong trạng thái hoàn hảo nhất với đội ngũ dọn dẹp chuyên nghiệp và tiêu chuẩn khách sạn 5 sao.'),
      meta: t('services.list.item_5_meta', 'Dịch vụ hàng ngày'),
      badge: t('services.badge_daily', 'Thường nhật') || 'Thường nhật'
    },
    {
      id: 'tour',
      icon: <CompassOutlined />,
      title: t('services.list.item_6_title', 'Trải nghiệm bản địa đặc quyền'),
      desc: t('services.list.item_6_desc', 'Lên lịch trình khám phá, đặt tour riêng, hướng dẫn viên chuyên nghiệp và vé tham quan các điểm du lịch nổi tiếng nhất.'),
      meta: t('services.list.item_6_meta', 'Thiết kế riêng biệt'),
      badge: t('services.badge_tour', 'Khám phá') || 'Khám phá'
    }
  ];

  const handleSubmit = (values: any) => {
    console.log('Concierge request values:', values);
    setIsLoading(true);
    // Simulate API request submission
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      form.resetFields();
    }, 1500);
  };

  return (
    <ConciergeWrapper>
      {/* Back link to home */}
      <BackLink to="/">
        <ArrowLeftOutlined />
        {t('list.back_to_home', 'Quay lại trang chủ')}
      </BackLink>

      {/* Hero Header */}
      <HeroSection>
        <HeroTitle>
          {t('services.hero_title', 'Dịch vụ quản gia ')}
          <span>{t('services.hero_title_highlight', 'Domin Concierge.')}</span>
        </HeroTitle>
        <HeroSubtitle>
          {t('services.hero_subtitle', 'Chăm sóc trọn vẹn từng khoảnh khắc nghỉ dưỡng của bạn với dịch vụ chuẩn thượng lưu.')}
        </HeroSubtitle>
      </HeroSection>

      {/* Intro section */}
      <IntroSection>
        <SectionLabel>{t('services.intro_title', 'Nâng tầm trải nghiệm')}</SectionLabel>
        <SectionHeading>{t('services.intro_title', 'Nâng tầm trải nghiệm')}</SectionHeading>
        <Paragraph>
          {t('services.intro_desc', 'Tại Domin Tactic, chúng tôi mang tới những dịch vụ tiện ích độc quyền được cá nhân hóa cho từng khách thuê, đảm bảo một kỳ nghỉ thượng lưu hoàn hảo và không lo nghĩ.')}
        </Paragraph>
      </IntroSection>

      {/* Services Cards Grid */}
      <ServicesGrid>
        {servicesList.map((service) => (
          <ServiceCard key={service.id} onClick={() => handleCardClick(service.title)}>
            <CardHeaderRow>
              <ServiceIcon>{service.icon}</ServiceIcon>
              <ServiceBadge>{service.badge}</ServiceBadge>
            </CardHeaderRow>
            <ServiceTitle>{service.title}</ServiceTitle>
            <ServiceDesc>{service.desc}</ServiceDesc>
            <ServiceMeta>{service.meta}</ServiceMeta>
          </ServiceCard>
        ))}
      </ServicesGrid>

      {/* Request Form Section */}
      <RequestSection id="request-service">
        <RequestInfo>
          <SectionLabel>{t('services.request_form_title', 'Yêu cầu dịch vụ')}</SectionLabel>
          <SectionHeading>{t('services.request_form_title', 'Yêu cầu dịch vụ')}</SectionHeading>
          <Paragraph>
            {t('services.request_form_desc', 'Chọn loại dịch vụ bạn cần và gửi yêu cầu, quản gia Domin Concierge sẽ liên hệ hỗ trợ bạn trong vòng 15 phút.')}
          </Paragraph>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontSize: '1.5rem', color: portalTheme.colors.onSurface }}>
              <PhoneOutlined style={{ color: portalTheme.colors.primary, fontSize: '1.8rem' }} />
              <strong>Hotline 24/7:</strong> +84 1900 8888 (Phím 3)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontSize: '1.5rem', color: portalTheme.colors.onSurface }}>
              <UserOutlined style={{ color: portalTheme.colors.primary, fontSize: '1.8rem' }} />
              <strong>Email:</strong> concierge@domintactic.com
            </div>
          </div>
        </RequestInfo>

        <FormCard>
          {isSubmitted ? (
            <Result
              status="success"
              title={t('services.msg_success_title', 'Yêu cầu đã được gửi!')}
              subTitle={t('services.msg_success_desc', 'Cảm ơn bạn. Quản gia Domin Concierge đã tiếp nhận yêu cầu và sẽ liên hệ hỗ trợ bạn ngay lập tức.')}
              extra={[
                <SubmitButton key="back" onClick={() => setIsSubmitted(false)}>
                  {t('booking_modal.btn_confirm', 'Gửi yêu cầu khác') || 'Gửi yêu cầu khác'}
                </SubmitButton>
              ]}
            />
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <FormTitle>{t('services.request_form_title', 'Gửi yêu cầu dịch vụ')}</FormTitle>
              
              <Form.Item
                name="fullName"
                rules={[{ required: true, message: t('services.validation_name', 'Vui lòng nhập họ và tên của bạn') }]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: portalTheme.colors.onSurfaceVariant }} />} 
                  placeholder={t('services.placeholder_name', 'Họ và tên của bạn')} 
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: t('services.validation_phone', 'Vui lòng nhập số điện thoại liên hệ') },
                  { pattern: /^[0-9]{10,11}$/, message: t('profile.validation.invalid_phone', 'Số điện thoại không hợp lệ!') }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined style={{ color: portalTheme.colors.onSurfaceVariant }} />} 
                  placeholder={t('services.placeholder_phone', 'Số điện thoại liên hệ')} 
                  size="large"
                />
              </Form.Item>

              <Form.Item name="roomNumber">
                <Input 
                  prefix={<HomeOutlined style={{ color: portalTheme.colors.onSurfaceVariant }} />} 
                  placeholder={t('services.placeholder_room', 'Căn hộ / Số phòng đang lưu trú')} 
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="serviceType"
                rules={[{ required: true, message: t('services.validation_service', 'Vui lòng chọn loại dịch vụ cần hỗ trợ') }]}
              >
                <Select
                  placeholder={t('services.placeholder_service', 'Chọn loại dịch vụ')}
                  size="large"
                >
                  {servicesList.map((service) => (
                    <Option key={service.id} value={service.id}>
                      {service.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="notes">
                <TextArea
                  rows={6}
                  placeholder={t('services.placeholder_notes', 'Chi tiết yêu cầu của bạn (Thời gian, số người, ghi chú thêm...)')}
                  size="large"
                  style={{ width: '100%', fontSize: '2rem' }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <SubmitButton 
                  type="primary" 
                  htmlType="submit" 
                  loading={isLoading}
                  icon={<SendOutlined />}
                >
                  {t('services.btn_submit', 'Gửi yêu cầu ngay')}
                </SubmitButton>
              </Form.Item>
            </Form>
          )}
        </FormCard>
      </RequestSection>
    </ConciergeWrapper>
  );
};

export default Concierge;
