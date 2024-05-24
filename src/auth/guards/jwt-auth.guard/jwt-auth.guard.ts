import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
@Injectable() //의존성  주입되는 시스템
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  //요청이 처리 되기 전에 실행 -> 인증 로직
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // -> 기본 인증 로직 후 실행
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException(); // 인증 실패 시 예외 발생
    }
    return user;
  }
}
