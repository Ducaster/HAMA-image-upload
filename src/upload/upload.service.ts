import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class UploadService {
  private s3: S3Client;
  private bucketName: string;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'ap-northeast-2',
      // IRSA로 권한을 얻기 때문에 별도의 credential 설정이 필요 없습니다.
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || '';
    if (!this.bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME is not defined');
    }
    console.log(
      `🔹 AWS S3 Client Initialized (IRSA & Gateway endpoint 사용중)`,
    );
  }

  async uploadToS3(
    file: Express.Multer.File,
    googleId: string,
  ): Promise<string> {
    const fileKey = `uploads/${googleId}_${Date.now()}_${file.originalname}`;

    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      await this.s3.send(new PutObjectCommand(params));
      console.log(`✅ File uploaded successfully: ${fileKey}`);
      return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    } catch (error) {
      console.error(`❌ S3 Upload Failed:`, error);
      throw new HttpException(
        'S3 Upload Failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
