import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || '',
    });
  }

  async getUser(googleId: string) {
    const data = await this.redisClient.get(`user:${googleId}`);
    return data ? JSON.parse(data) : null;
  }

  async onModuleInit() {
    console.log('🚀 Redis Connected');
  }

  async onModuleDestroy() {
    this.redisClient.disconnect();
  }
}
