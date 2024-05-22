import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { user } from '../entities';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto';

@Injectable()
export class UserRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async findUserbyEmail(email: string): Promise<user> {
    return this.entityManager.findOne(user, { where: { email } }); //범용이라 첫번째에 해당 엔티티 받음
  }

  async createUser(dto: CreateUserDto, hashPassword): Promise<user> {
    const User = new user();
    User.name = dto.name;
    User.email = dto.email;
    User.password = hashPassword;
    return this.entityManager.save(User);
  }
  async getAllUser(): Promise<user[]> {
    return this.entityManager.find(user);
  }

  async findOneUser(userId: number): Promise<user> {
    return this.entityManager.findOne(user, { where: { userId } });
  }

  async updateUser(userId: number, dto: UpdateUserDto) {
    return this.entityManager.update(user, userId, dto);
  }

  async deleteUser(userId: number) {
    return this.entityManager.delete(user, userId);
  }
}

// 암호화한 비밀번호가 들어온다 이 비밀번호를 User로 만든 객체 user에 넣고 객체를 저장함
// entityManager는 데이터베이스와 상호작용하는데 사용 특정 엔티티 국한x
