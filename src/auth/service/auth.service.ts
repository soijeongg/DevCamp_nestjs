import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { AcessTokenRepository } from '../repositories/accessToken.repository';
import { RefashTokenRepository } from '../repositories/refrashToken.repository';
import { UserRepository } from 'src/user/repositories/user.respository';
import { loginReqDTO } from '../dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { TokenPayload } from '../types';
import * as argon2 from 'argon2';
import { blacklistTokenRepo } from '../repositories/blacklisted_token.repository';
@Injectable()
export class AuthService {
  constructor(
    private readonly accessToekn: AcessTokenRepository,
    private readonly refrashToken: RefashTokenRepository,
    private readonly user: UserRepository,
    private readonly jwtService: JwtService,
    private readonly blacklist: blacklistTokenRepo,
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
      sub: userId, //사용자의 고유식별자, sub(subject) 클레임은 JWT의 표준 클레임 중 하나로, 토큰의 주제
      iat: Math.floor(Date.now() / 1000), //토큰이 발급된 시간 밀리초라서 높이기
      jti: uuidv4(), //jwt의 고유식별자
    };
  }

  async login(dto: loginReqDTO) {
    const user = await this.checkUser(dto);
    const payload = this.createTokenPayload(user.userId.toString());
    const accessToken = this.jwtService.sign(payload); //NestJS에서 제공하는 JwtService sign은 페이로드를 사용해 jwt생성
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

  async logout(accessToken: string, refrashToken: string): Promise<void> {
    try {
      const checkToken = this.jwtService.verify(accessToken) as TokenPayload;
      const checkRefrashToken = this.jwtService.verify(
        refrashToken,
      ) as TokenPayload;
      const accessTokenEntity =
        await this.accessToekn.findAcessToken(accessToken);
      const refreshTokenEntity =
        await this.refrashToken.findRefrashToken(refrashToken);
      if (!accessTokenEntity || !refreshTokenEntity) {
        throw new HttpException(
          '존재하지 않는 토큰입니다',
          HttpStatus.BAD_REQUEST,
        );
      }
      accessTokenEntity.isRevoked = true;
      refreshTokenEntity.isRevoked = true;
      await this.accessToekn.saveAToken(
        accessTokenEntity.jti,
        accessTokenEntity.expiresAt,
        accessTokenEntity.token,
        accessTokenEntity.user,
        accessTokenEntity.isRevoked,
      );
      await this.refrashToken.saveRToken(
        refreshTokenEntity.jti,
        refreshTokenEntity.expiresAt,
        refreshTokenEntity.token,
        refreshTokenEntity.user,
        refreshTokenEntity.isRevoked,
      );
      const refrashexpiresAt = new Date(checkRefrashToken.iat * 1000);
      const expiresAt = new Date(checkToken.iat * 1000);
      await this.blacklist.addToBlacklist(accessToken, expiresAt);
      await this.blacklist.addToBlacklist(refrashToken, refrashexpiresAt);
    } catch (error) {
      throw new HttpException(
        '존재하지 않는 토큰입니다',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
//엑세스 토큰 확인 -> 맞으면 그 토큰과 리프래시토큰을 만료시킨다
