import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { JwtModule } from '@nestjs/jwt'; // ✅ 추가
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; // ✅ 추가
import { JwtStrategy } from '../auth/jwt.strategy'; // ✅ 추가 (없다면 생성 필요)

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret', // ✅ JWT 시크릿 키 설정
      signOptions: { expiresIn: '1h' }, // ✅ 액세스 토큰 만료 시간 설정
    }),
  ],
  providers: [UploadService, JwtAuthGuard, JwtStrategy], // ✅ 추가
  controllers: [UploadController],
})
export class UploadModule {}
