import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Select, Switch, Upload, message, Typography, Space, Row, Col } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from '@tanstack/react-router';
import type { UploadFile } from 'antd/es/upload/interface';
import { useCreateApartment, useUpdateApartment } from '../../../services/mutation';
import { useS3Upload } from '../../../hooks/useS3Upload';
import { useApartmentDetail } from '../../../../portal/services/query';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { TextArea } = Input;

const ApartmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('admin');
  // We use strict: false so we can reuse this component for both create and edit routes.
  const { id } = useParams({ strict: false }) as { id?: string };
  const isEditMode = !!id;

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { data: detailResponse, isLoading: isLoadingDetail } = useApartmentDetail(id ?? '', {
    enabled: isEditMode,
  });

  const { mutate: createApt, isPending: isCreating } = useCreateApartment();
  const { mutate: updateApt, isPending: isUpdating } = useUpdateApartment();
  const { uploadFile, isUploading } = useS3Upload();

  const AMENITY_OPTIONS = [
    { value: 'WiFi', label: 'WiFi' },
    { value: 'Pool', label: 'Pool' },
    { value: 'Gym', label: 'Gym' },
    { value: 'Air Conditioning', label: 'Air Conditioning' },
    { value: 'Kitchen', label: 'Kitchen' },
    { value: 'Parking', label: 'Parking' },
    { value: 'Washer', label: 'Washer' },
    { value: 'Dryer', label: 'Dryer' },
    { value: 'TV', label: 'TV' },
    { value: 'Heating', label: 'Heating' },
  ];

  useEffect(() => {
    if (isEditMode && detailResponse?.data) {
      const apt = detailResponse.data;
      form.setFieldsValue({
        title: apt.title,
        description: apt.description,
        pricePerNight: apt.pricePerNight,
        cleaningFee: apt.cleaningFee,
        serviceFee: apt.serviceFee,
        maxGuests: apt.maxGuests,
        location: apt.location,
        amenities: apt.amenities,
        isActive: apt.isActive,
        isAutoApprove: apt.isAutoApprove,
      });

      if (apt.images && apt.images.length > 0) {
        const initialFiles = apt.images.map((url: string, index: number) => ({
          uid: `-initial-${index}`,
          name: `image-${index}`,
          status: 'done' as const,
          url: url,
        }));
        setFileList(initialFiles);
      }
    }
  }, [isEditMode, detailResponse, form]);

  const onFinish = async (values: any) => {
    try {
      // 1. Handle image uploads
      const newImagesUrls: string[] = [];
      const existingImagesUrls: string[] = [];

      for (const file of fileList) {
        if (file.url) {
          existingImagesUrls.push(file.url);
        } else if (file.originFileObj) {
          const publicUrl = await uploadFile(file.originFileObj as File);
          if (publicUrl) {
            newImagesUrls.push(publicUrl);
          } else {
            throw new Error(t('owner.errors.upload_failed', 'Failed to upload one or more images.'));
          }
        }
      }

      const allImages = [...existingImagesUrls, ...newImagesUrls];

      const payload = {
        title: values.title,
        description: values.description,
        pricePerNight: values.pricePerNight,
        cleaningFee: values.cleaningFee,
        serviceFee: values.serviceFee,
        maxGuests: values.maxGuests,
        location: values.location,
        amenities: values.amenities || [],
        images: allImages,
        isActive: values.isActive,
        isAutoApprove: values.isAutoApprove,
      };

      // 2. Submit to backend
      if (isEditMode) {
        updateApt(
          { id, payload },
          { onSuccess: () => navigate({ to: '/quan-ly/danh-sach-can-ho' }) }
        );
      } else {
        createApt(
          payload,
          { onSuccess: () => navigate({ to: '/quan-ly/danh-sach-can-ho' }) }
        );
      }
    } catch (error: any) {
      message.error(error.message || t('owner.errors.submit_failed', 'An error occurred during submission.'));
    }
  };

  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  if (isEditMode && isLoadingDetail) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>{t('owner.form.loading_detail', 'Loading apartment details...')}</div>;
  }

  const isLoading = isCreating || isUpdating || isUploading;

  return (
    <div style={{ maxWidth: 1200 }}>
      <Space style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate({ to: '/quan-ly/danh-sach-can-ho' })}>
          {t('owner.form.back', 'Back')}
        </Button>
        <Title level={2} style={{ margin: 0 }}>
          {isEditMode ? t('owner.form.edit_title', 'Edit Apartment') : t('owner.form.add_title', 'Add New Apartment')}
        </Title>
      </Space>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ isActive: true, isAutoApprove: false, amenities: [] }}
      >
        <Row gutter={[32, 24]}>
          <Col xs={24} lg={15}>
            <Form.Item
              name="title"
              label={t('owner.form.property_title_label', 'Property Title')}
              rules={[{ required: true, message: t('owner.form.property_title_required', 'Please enter a title') }]}
            >
              <Input placeholder={t('owner.form.property_title_placeholder', 'E.g., The Heritage Penthouse')} size="large" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="location"
              label={t('owner.form.location_label', 'Location')}
              rules={[{ required: true, message: t('owner.form.location_required', 'Please enter the location') }]}
            >
              <Input placeholder={t('owner.form.location_placeholder', 'E.g., Carmel Valley, California')} size="large" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="description" label={t('owner.form.description_label', 'Description')}>
              <TextArea rows={10} placeholder={t('owner.form.description_placeholder', 'Describe your property...')} style={{ width: '100%', minHeight: 180 }} />
            </Form.Item>
          </Col>

          <Col xs={24} lg={9}>
            <Form.Item
              name="pricePerNight"
              label={t('owner.form.price_label', 'Price per Night (VNĐ)')}
              rules={[{ required: true, message: t('owner.form.price_required', 'Please enter the price') }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                size="large"
                addonAfter="đ"
                placeholder={t('owner.form.price_placeholder', '0')}
              />
            </Form.Item>

            <Form.Item
              name="cleaningFee"
              label={t('owner.form.cleaning_fee_label', 'Phí vệ sinh (VNĐ)')}
              rules={[{ required: true, message: t('owner.form.cleaning_fee_required', 'Vui lòng nhập phí vệ sinh') }]}
              initialValue={120000}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                size="large"
                addonAfter="đ"
                placeholder={t('owner.form.cleaning_fee_placeholder', '0')}
              />
            </Form.Item>

            <Form.Item
              name="serviceFee"
              label={t('owner.form.service_fee_label', 'Phí dịch vụ (VNĐ)')}
              rules={[{ required: true, message: t('owner.form.service_fee_required', 'Vui lòng nhập phí dịch vụ') }]}
              initialValue={85000}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                size="large"
                addonAfter="đ"
                placeholder={t('owner.form.service_fee_placeholder', '0')}
              />
            </Form.Item>

            <Form.Item
              name="maxGuests"
              label={t('owner.form.max_guests_label', 'Số người ở tối đa')}
              rules={[{ required: true, message: t('owner.form.max_guests_required', 'Vui lòng nhập số người ở tối đa') }]}
              initialValue={2}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                size="large"
                placeholder={t('owner.form.max_guests_placeholder', '2')}
              />
            </Form.Item>

            <Form.Item name="amenities" label={t('owner.form.amenities_label', 'Amenities')}>
              <Select
                mode="multiple"
                allowClear
                placeholder={t('owner.form.amenities_placeholder', 'Select amenities')}
                options={AMENITY_OPTIONS}
                size="large"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item 
              label={t('owner.form.images_label', 'Images')} 
              required 
              tooltip={t('owner.form.images_tooltip', 'Upload at least one image')}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false} // Prevent automatic upload
                accept="image/*"
              >
                {fileList.length >= 8 ? null : (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>{t('owner.form.images_upload_btn', 'Upload')}</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item name="isActive" label={t('owner.form.status_label', 'Status')} valuePropName="checked">
              <Switch 
                checkedChildren={t('owner.form.status_active', 'Active')} 
                unCheckedChildren={t('owner.form.status_draft', 'Draft')} 
              />
            </Form.Item>

            <Form.Item name="isAutoApprove" label={t('owner.form.auto_approve_label', 'Tự động duyệt booking')} valuePropName="checked">
              <Switch 
                checkedChildren={t('owner.form.status_enabled', 'Bật')} 
                unCheckedChildren={t('owner.form.status_disabled', 'Tắt')} 
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
                block
              >
                {isEditMode ? t('owner.form.save_btn', 'Save Changes') : t('owner.form.publish_btn', 'Publish Property')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ApartmentForm;
