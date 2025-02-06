import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-providers'; // ✅ 환경변수에서 크레덴셜 가져오기
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class UploadService {
  private s3: S3Client;
  private bucketName: string;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'ap-northeast-2',
      credentials: fromEnv(), // ✅ AWS 크레덴셜을 안전하게 가져오기
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || '';
    console.log(`🔹 AWS S3 Client Initialized`);
  }

  async uploadToS3(
    file: Express.Multer.File,
    googleId: string,
  ): Promise<string> {
    if (!this.bucketName) {
      throw new HttpException(
        'AWS S3 Bucket Name is not defined',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // ✅ Google ID를 포함한 파일 이름 생성
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
