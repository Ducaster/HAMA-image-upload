import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';

@Injectable()
export class BoardService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(
    userId: string,
    title: string,
    content: string,
    imageUrl?: string,
  ) {
    const newPost = new this.postModel({ userId, title, content, imageUrl });
    return newPost.save();
  }

  async getAllPosts() {
    return this.postModel.find().sort({ createdAt: -1 }).exec();
  }
}
