import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User) //특정 엔티티의 레파지토리를 의존관계로 주입할때 사용
    private readonly repo: Repository<User>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async findUserbyEmail(email: string): Promise<User> {
    return this.repo.findOneBy({ email });
  }

  async createUser(dto: CreateUserDto, hashPassword): Promise<User> {
    const user = new User();
    user.name = dto.name;
    user.email = dto.email;
    user.password = hashPassword;
    return this.repo.save(user);
  }
}

// 암호화한 비밀번호가 들어온다 이 비밀번호를 User로 만든 객체 user에 넣고 객체를 저장함
