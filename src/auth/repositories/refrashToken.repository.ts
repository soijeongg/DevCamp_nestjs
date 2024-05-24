import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { RefrashToken } from '../entities';
import { user } from 'src/user/entities';
@Injectable()
export class RefashTokenRepository {
  constructor(private readonly enityManager: EntityManager) {}

  async saveRToken(
    jti: string,
    expiresAt: Date,
    token: string,
    user: user,
    isRevoked?: boolean,
  ): Promise<RefrashToken> {
    const refrashToken = new RefrashToken();
    refrashToken.jti = jti;
    refrashToken.user = user;
    refrashToken.token = token;
    refrashToken.expiresAt = expiresAt;
    if (!isRevoked) {
      refrashToken.isRevoked = false;
    } else {
      refrashToken.isRevoked = isRevoked;
    }
    return this.enityManager.save(refrashToken);
  }

  async findRefrashToken(token: string) {
    return this.enityManager.findOne(RefrashToken, { where: { token } });
  }
}
