import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    // ✅ 환경 변수 설정 추가
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ Valkey(=Redis) 모듈 추가
    RedisModule,

    // ✅ 파일 업로드 기능 추가
    UploadModule,
  ],
})
export class AppModule {}
