import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 9)) // 한 번에 최대 5개 파일 업로드 가능
  async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    console.log(`📥 Received ${files.length} files`);

    const uploadResults = await Promise.all(
      files.map((file) => this.uploadService.uploadToS3(file)),
    );

    return { images: uploadResults };
  }
}
