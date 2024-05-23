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
  ): Promise<RefrashToken> {
    const refrashToken = new RefrashToken();
    refrashToken.jti = jti;
    refrashToken.user = user;
    refrashToken.token = token;
    refrashToken.expiresAt = expiresAt;
    refrashToken.isRevoked = false;
    return this.enityManager.save(refrashToken);
  }
}
