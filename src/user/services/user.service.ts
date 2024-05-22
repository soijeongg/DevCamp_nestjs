import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../repositories/user.respository';
import * as argon2 from 'argon2';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  //비밀번호 암호화 후 user Repository의 createUser로 보낸다
  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findUserbyEmail(createUserDto.email);
    if (user) {
      throw new HttpException(
        '이미 해당 이메일을 가진 유저가 존재합니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await argon2.hash(createUserDto.password);
    return this.userRepository.createUser(createUserDto, hashPassword);
  }

  async findAll() {
    return await this.userRepository.getAllUser();
  }

  async findOne(userId: number) {
    return await this.userRepository.findOneUser(userId);
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const finduser = await this.userRepository.findOneUser(userId);
    if (!finduser) {
      throw new HttpException(
        '해당 유저가 존재하지 않습니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (updateUserDto.password) {
      updateUserDto.password = await argon2.hash(updateUserDto.password);
    }
    const updateUserSerive = await this.userRepository.updateUser(
      userId,
      updateUserDto,
    );
    if (!updateUserSerive) {
      throw new HttpException(
        '업데이트에 실패했습니다 다시 한번 시도해주세요',
        HttpStatus.BAD_REQUEST,
      );
    }
    return updateUserSerive;
  }

  async remove(userId: number) {
    const finduser = await this.userRepository.findOneUser(userId);
    if (!finduser) {
      throw new HttpException(
        '해당 유저가 존재하지 않습니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    const deleteUserService = await this.userRepository.deleteUser(userId);
    if (!deleteUserService) {
      throw new HttpException(
        '회원정보 삭제에 실패했습니다 다시 한번 시도해주세요',
        HttpStatus.BAD_REQUEST,
      );
    }
    return deleteUserService;
  }
}

// EntityManager와 Repository의 차이
//InjectEntityManager을 통해 EntityManager를 주입받는 방식은 특정 엔티티에 국한X
//여러 데이터베이스 묶을 수 있음

// Repository는 특정 엔티티에 최적하고 단순함 각 엔티티마다 별도의 리포지토리
// private readonly userRepository: UserRepository를 사용했었는데 엔티티가 늘어나면서 바꾸기로함
