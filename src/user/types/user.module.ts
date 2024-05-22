import { Module } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserController } from '../controller/user.controller';
import { UserRepository } from '../repositories/user.respository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { user } from './../entities/index';

@Module({
  imports: [TypeOrmModule.forFeature([user, UserRepository])],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository],
})
export class UserModule {}

// TypeOrmModule.forFeature은 엔티티와 커스텀레포지토리를 등록함
