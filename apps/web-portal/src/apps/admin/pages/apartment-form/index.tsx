import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Select, Switch, Upload, message, Typography, Space, Card } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from '@tanstack/react-router';
import type { UploadFile } from 'antd/es/upload/interface';
import { useCreateApartment, useUpdateApartment } from '../../services/mutation';
import { useS3Upload } from '../../hooks/useS3Upload';
import { useApartmentDetail } from '../../../portal/services/query';

const { Title } = Typography;
const { TextArea } = Input;

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

const ApartmentForm: React.FC = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (isEditMode && detailResponse?.data) {
      const apt = detailResponse.data;
      form.setFieldsValue({
        title: apt.title,
        description: apt.description,
        pricePerNight: apt.pricePerNight,
        location: apt.location,
        amenities: apt.amenities,
        isActive: apt.isActive,
      });

      if (apt.images && apt.images.length > 0) {
        const initialFiles = apt.images.map((url, index) => ({
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
            throw new Error('Failed to upload one or more images.');
          }
        }
      }

      const allImages = [...existingImagesUrls, ...newImagesUrls];

      const payload = {
        title: values.title,
        description: values.description,
        pricePerNight: values.pricePerNight,
        location: values.location,
        amenities: values.amenities || [],
        images: allImages,
        isActive: values.isActive,
      };

      // 2. Submit to backend
      if (isEditMode) {
        updateApt(
          { id, payload },
          { onSuccess: () => navigate({ to: '/quan-ly/can-ho' }) }
        );
      } else {
        createApt(
          payload,
          { onSuccess: () => navigate({ to: '/quan-ly/can-ho' }) }
        );
      }
    } catch (error: any) {
      message.error(error.message || 'An error occurred during submission.');
    }
  };

  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  if (isEditMode && isLoadingDetail) {
    return <div>Loading apartment details...</div>;
  }

  const isLoading = isCreating || isUpdating || isUploading;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Space style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate({ to: '/quan-ly/can-ho' })}>
          Back
        </Button>
        <Title level={2} style={{ margin: 0 }}>
          {isEditMode ? 'Edit Apartment' : 'Add New Apartment'}
        </Title>
      </Space>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ isActive: true, amenities: [] }}
        >
          <Form.Item
            name="title"
            label="Property Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="E.g., The Heritage Penthouse" size="large" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please enter the location' }]}
          >
            <Input placeholder="E.g., Carmel Valley, California" size="large" />
          </Form.Item>

          <Form.Item
            name="pricePerNight"
            label="Price per Night (USD)"
            rules={[{ required: true, message: 'Please enter the price' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              size="large"
              prefix="$"
              placeholder="0"
            />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={5} placeholder="Describe your property..." />
          </Form.Item>

          <Form.Item name="amenities" label="Amenities">
            <Select
              mode="multiple"
              allowClear
              placeholder="Select amenities"
              options={AMENITY_OPTIONS}
              size="large"
            />
          </Form.Item>

          <Form.Item label="Images" required tooltip="Upload at least one image">
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
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item name="isActive" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Draft" />
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading}
              block
            >
              {isEditMode ? 'Save Changes' : 'Publish Property'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ApartmentForm;
