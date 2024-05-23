import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessToken, RefrashToken } from '../entities';
import { user } from 'src/user/entities';
import { UserRepository } from 'src/user/repositories/user.respository';
import {
  RefashTokenRepository,
  AcessTokenRepository,
} from '../repositories/index';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessToken, RefrashToken, user]),
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
  ],
  controllers: [AuthController],
})
export class AuthModule {}
