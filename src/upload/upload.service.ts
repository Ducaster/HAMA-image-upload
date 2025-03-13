import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

@Injectable()
export class UploadService {
  private s3: S3Client;
  private sqs: SQSClient;
  private bucketName: string;
  private sqsQueueUrl: string;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'ap-northeast-2',
    });

    this.sqs = new SQSClient({
      region: process.env.AWS_REGION || 'ap-northeast-2',
    });

    this.bucketName = process.env.AWS_S3_BUCKET_NAME || '';
    this.sqsQueueUrl =
      process.env.AWS_SQS_QUEUE_URL ||
      'https://sqs.ap-northeast-2.amazonaws.com/788089450664/image-processing-queue';

    if (!this.bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME is not defined');
    }
    if (!this.sqsQueueUrl) {
      throw new Error('AWS_SQS_QUEUE_URL is not defined');
    }

    console.log(`🔹 AWS S3 Client & SQS Client Initialized (IRSA 사용중)`);
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
      // ✅ Step 1: S3에 파일 업로드
      await this.s3.send(new PutObjectCommand(params));
      console.log(`✅ File uploaded successfully: ${fileKey}`);

      const fileUrl = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

      // ✅ Step 2: SQS에 메시지 전송
      const messageBody = JSON.stringify({
        googleId,
        fileKey,
        bucketName: this.bucketName,
        uploadedAt: new Date().toISOString(),
      });

      await this.sqs.send(
        new SendMessageCommand({
          QueueUrl: this.sqsQueueUrl,
          MessageBody: messageBody,
        }),
      );

      console.log(`✅ SQS Message sent: ${messageBody}`);

      return fileUrl;
    } catch (error) {
      console.error(`❌ Upload or SQS Message Failed:`, error);
      throw new HttpException(
        'Upload Failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
