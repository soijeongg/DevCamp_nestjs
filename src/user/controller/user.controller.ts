import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { HttpException } from '@nestjs/common';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const createUser = await this.userService.create(createUserDto);
      if (!createUser) {
        throw new HttpException(
          '회원가입 과정에서 에러가 발생하였습니다 다시 한번 시도해주세요',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return { message: `${createUserDto.name}님 환영합니다` };
    } catch (error) {
      throw new HttpException(
        error.response ||
          '회원가입 과정에서 에러가 발생하였습니다 다시 한번 시도해주세요',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.userService.findOne(+userId);
  }

  @Put(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const updateUserController = await this.userService.update(
        +userId,
        updateUserDto,
      );
      if (!updateUserController) {
        throw new HttpException(
          '정보 업데이트 과정에서 에러가 발생했습니다 다시 한번시도해주세요',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return { message: '정보 업데이트가 완료되었습니다' };
    } catch (error) {
      {
        throw new HttpException(
          error.response ||
            '정보 업데이트에 오류가 발생했습니다 다시 한번 시도해주세요',
          error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Delete(':userId')
  async reemove(@Param('userId') userId: string) {
    try {
      const deleteUserController = await this.userService.remove(+userId);
      if (!deleteUserController) {
        throw new HttpException(
          '삭제에 실패했습니다 다시 한번 시도해주세요',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return { message: '회원을 삭제했습니다' };
    } catch (error) {
      throw new HttpException(
        error.response || '회원삭제에 실패했습니다 다시 한번 시도해주세요',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
