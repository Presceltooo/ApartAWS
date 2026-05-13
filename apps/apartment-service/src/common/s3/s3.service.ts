import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;
  private readonly logger = new Logger(S3Service.name);

  // Validation Config
  private readonly ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION') || 'ap-southeast-1';
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET') || 'apartaws-uploads';

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      },
      // Ngăn chặn tự động thêm Checksum gây lỗi 400 Bad Request
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    } as any);
  }

  async generatePresignedUrl(fileName: string, contentType: string, fileSize?: number) {
    // 1. Validate File Type
    if (!this.ALLOWED_MIME_TYPES.includes(contentType.toLowerCase())) {
      throw new BadRequestException(
        `File type ${contentType} is not allowed. Supported types: ${this.ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }

    // 2. Validate File Size (if provided)
    if (fileSize && fileSize > this.MAX_FILE_SIZE) {
      throw new BadRequestException('File size exceeds 5MB limit.');
    }

    // 3. Generate Unique File Key
    const fileExtension = path.extname(fileName) || `.${contentType.split('/')[1]}`;
    const uniqueFileName = `${crypto.randomUUID()}${fileExtension}`;
    const fileKey = `apartments/${uniqueFileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: contentType,
    });

    try {
      const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      const publicUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileKey}`;

      return {
        uploadUrl,
        fileKey,
        publicUrl,
      };
    } catch (error) {
      this.logger.error('Error generating presigned URL', error);
      throw error;
    }
  }
}
