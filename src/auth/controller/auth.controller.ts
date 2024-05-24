import { Controller, Body, Post, Delete, UseGuards, Req } from '@nestjs/common';
import { loginReqDTO } from '../dto';
import { AuthService } from '../service/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {} // 빈블록: 생성ㄹ자 본체에 아무런 코드 없음
  @Post('login')
  async login(
    @Body()
    dto: loginReqDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authservice.login(dto);
  }

  @Delete('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req): Promise<void> {
    const accessToken = req.headers.authorization.split(' ')[1];
    const refrashToken = req.headers.authorization.split(' ')[2];
    await this.authservice.logout(accessToken, refrashToken);
  }
}
