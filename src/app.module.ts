import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // ✅ 환경 변수 설정 추가
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ 파일 업로드 기능 추가
    UploadModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // ✅ JWT 시크릿 키 설정
      signOptions: { expiresIn: '1h' }, // ✅ 액세스 토큰 만료 시간 설정
    }),
  ],
})
export class AppModule {}
