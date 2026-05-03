import { useState, useCallback } from 'react';
import { notification } from 'antd';
import { getPresignedUrl, uploadToS3 } from '../services/api';

export const useS3Upload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      // 1. Get presigned URL
      const response = await getPresignedUrl(file.name, file.type, file.size);
      const { uploadUrl, publicUrl } = response.data;

      // 2. Upload file directly to S3
      await uploadToS3(uploadUrl, file);

      // 3. Return the public URL
      return publicUrl;
    } catch (error: any) {
      console.error('S3 Upload Error:', error);
      notification.error({
        message: 'Upload Failed',
        description: 'Failed to upload image to S3. Please try again.',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    uploadFile,
    isUploading,
  };
};
