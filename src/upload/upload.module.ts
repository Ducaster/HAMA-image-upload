import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService], // ✅ 다른 모듈에서도 사용 가능하도록 설정
})
export class UploadModule {}
