import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ✅ 헤더에서 JWT 토큰 추출
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'defaultSecret', // ✅ JWT 시크릿 키 설정
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email }; // ✅ JWT 페이로드에서 사용자 정보 추출
  }
}
