import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { AccessToken } from '../entities';
import { user } from 'src/user/entities';

@Injectable()
export class AcessTokenRepository {
  constructor(private readonly enityManager: EntityManager) {}

  async saveAToken(
    jti: string,
    expiresAt: Date,
    token: string,
    user: user,
    isRevoked?: boolean,
  ): Promise<AccessToken> {
    const accesToken = new AccessToken();
    accesToken.jti = jti;
    accesToken.user = user;
    accesToken.token = token;
    accesToken.expiresAt = expiresAt;
    if (!isRevoked) {
      accesToken.isRevoked = false;
    } else {
      accesToken.isRevoked = isRevoked;
    }
    return this.enityManager.save(accesToken);
  }

  async findAcessToken(token: string) {
    return this.enityManager.findOne(AccessToken, { where: { token } });
  }
}
