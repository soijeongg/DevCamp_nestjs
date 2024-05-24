import { EntityManager } from 'typeorm';
import { BlacklistedToken } from '../entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class blacklistTokenRepo {
  constructor(private readonly entityManger: EntityManager) {}

  async isTokenInBlacklist(token: string) {
    const Token = await this.entityManger.findOne(BlacklistedToken, {
      where: { token },
    });
    return Token;
  }

  async addToBlacklist(
    token: string,
    expiresAt: Date,
  ): Promise<BlacklistedToken> {
    const blacklistedtoken = new BlacklistedToken();
    blacklistedtoken.token = token;
    blacklistedtoken.expiresAt = expiresAt;
    return this.entityManger.save(blacklistedtoken);
  }
}
