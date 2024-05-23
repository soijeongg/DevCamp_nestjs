import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { AcessTokenRepository } from '../repositories/accessToken.repository';
import { RefashTokenRepository } from '../repositories/refrashToken.repository';
import { UserRepository } from 'src/user/repositories/user.respository';
import { loginReqDTO } from '../dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { TokenPayload } from '../types';
import * as argon2 from 'argon2';
@Injectable()
export class AuthService {
  constructor(
    private readonly accessToekn: AcessTokenRepository,
    private readonly refrashToken: RefashTokenRepository,
    private readonly user: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async checkUser(dto: loginReqDTO) {
    const user = await this.user.findByEmail(dto.email);
    if (!user) {
      throw new HttpException(
        '이메일이나 비밀번호가 틀립니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    const passwordMatch = await argon2.verify(user.password, dto.password);
    if (!passwordMatch) {
      throw new HttpException(
        '이메일이나 비밀번호가 틀립니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  createTokenPayload(userId: string): TokenPayload {
    return {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      jti: uuidv4(),
    };
  }

  async login(dto: loginReqDTO) {
    const user = await this.checkUser(dto);
    const payload = this.createTokenPayload(user.userId.toString());
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const RexpiresAt = new Date(Date.now() + 7 * 60 * 60 * 1000);

    await this.accessToekn.saveAToken(
      payload.jti,
      expiresAt,
      accessToken,
      user,
    );
    await this.refrashToken.saveRToken(
      payload.jti,
      RexpiresAt,
      refreshToken,
      user,
    );
    return {
      accessToken,
      refreshToken,
    };
  }
}
