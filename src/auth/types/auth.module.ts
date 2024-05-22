import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessToken, RefrashToken } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([AccessToken, RefrashToken])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
