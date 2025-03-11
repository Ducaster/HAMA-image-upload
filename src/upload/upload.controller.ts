import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('multiple')
  @UseGuards(JwtAuthGuard) // ✅ JWT 인증 추가
  @UseInterceptors(FilesInterceptor('files', 9)) // ✅ 최대 9개 파일 업로드 가능
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    const googleId = req.user.userId; // ✅ JWT에서 Google ID 추출
    if (!googleId) {
      throw new Error('User Google ID is missing');
    }

    // ✅ Google ID를 포함하여 각 파일 업로드
    const uploadResults = await Promise.all(
      files.map((file) => this.uploadService.uploadToS3(file, googleId)),
    );
    return { imageUrls: uploadResults };
  }
}
