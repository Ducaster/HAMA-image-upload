import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createPost(@Req() req, @Body() body) {
    const { title, content, imageUrl } = body;
    return this.boardService.createPost(req.user.sub, title, content, imageUrl);
  }

  @Get('list')
  async getAllPosts() {
    return this.boardService.getAllPosts();
  }
}
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    return { imageUrl: file.location };
  }
}
