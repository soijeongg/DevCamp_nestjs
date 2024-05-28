import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Res } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { applyCouponDto } from 'src/auth/dto/applyCoupon.dto';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  findAll(@Res() res: Response) {
    const userId = res.locals.userId;
    if (!userId) {
      throw new HttpException(
        '유저가 존재하지 않습니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.paymentService.findAll(userId);
  }

  @Post('/apply')
  async applyCoupon(
    couponDto: applyCouponDto,
    @Res() res: Response,
  ): Promise<void> {
    const userId = res.locals.userId;
    if (!userId) {
      throw new HttpException(
        '유저가 존재하지 않습니다',
        HttpStatus.BAD_REQUEST,
      );
    }

    const discountedAmount = await this.paymentService.applyCoupon(
      userId,
      couponDto.coouponId,
      couponDto.amount,
    );
    res.status(HttpStatus.OK).json({ discountedAmount });
  }
}
