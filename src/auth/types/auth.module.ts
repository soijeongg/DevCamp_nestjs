import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessToken, RefrashToken, BlacklistedToken } from '../entities';
import { user } from 'src/user/entities';
import { UserRepository } from 'src/user/repositories/user.respository';
import {
  RefashTokenRepository,
  AcessTokenRepository,
  blacklistTokenRepo,
} from '../repositories/index';
import { JwtAuthGuard } from '../guards/jwt-auth.guard/jwt-auth.guard';
import { JwtStrategy } from '../strategies/jwt.strategy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccessToken,
      RefrashToken,
      BlacklistedToken,
      user,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    AcessTokenRepository,
    RefashTokenRepository,
    UserRepository,
    blacklistTokenRepo,
    JwtAuthGuard,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
