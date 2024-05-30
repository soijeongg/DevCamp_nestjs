import { Body, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto, TossPaymentDto, reqPointOrderDto } from '../dto/index';
import { CouponRepository, PointRepository } from '../repositories/index';
import { HttpException } from '@nestjs/common';
import { UserRepository } from 'src/user/repositories/user.respository';
import axios from 'axios';
@Injectable()
export class PaymentService {
  private readonly tossurl: string;
  private readonly secretkey: string;
  constructor(
    private readonly couponRepository: CouponRepository,
    private readonly userRepository: UserRepository,
    private readonly pointRepository: PointRepository,
  ) {
    this.tossurl = 'http://api.tosspayments.com/v1/payments/',
     this.secretkey = process.env.TOSS_TEST_KEY}
  //쿠폰 생성 -> 쿠폰 받음
  async create(createPaymentDto: CreatePaymentDto) {
    return await this.couponRepository.createCoupon(createPaymentDto);
  }
  //내가 가지고 있는 전체 쿠폰을 조회한다
  async findAll(userId: number) {
    return await this.couponRepository.findAllCoupon(userId);
  }

  //쿠폰을 사용하고 삭제한다  -> res.local에 유저아이디를 저장한다 이 유저 아이디를 통해 이 유저가 가지고 있는 쿠폰중 이 쿠폰아이디가 있는지 검색한다
  //없으면 HttpException를 사용해 오류를 반환하고 있으면 들어온 금액에 쿠폰을 적용한 후 적용한 금액을 반환한다
  async applyCoupon(
    userId: number,
    couponId: number,
    amount: number,
  ): Promise<number> {
    const findUser = await this.userRepository.findOneUser(userId);
    if (!findUser) {
      throw new HttpException(
        '해당 유저가 존재하지 않습니다',
        HttpStatus.BAD_REQUEST,
      );
    }

    const coupon = await this.couponRepository.findCouponForUser(
      userId,
      couponId,
    );
    if (!coupon) {
      throw new HttpException(
        '해당 사용자에게 해당 쿠폰이 존재하지 않습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    if (coupon.expirationDate < new Date()) {
      throw new HttpException('Coupon has expired', HttpStatus.BAD_REQUEST);
    }
    if (coupon.type == 'fixed' && coupon.discount) {
      amount = amount - coupon.discount;
    } else if (coupon.type == 'percent' && coupon.percent) {
      amount = amount - (amount * coupon.percent) / 100;
    }
    if (amount < 0) {
      amount = 0;
    }
    await this.couponRepository.deleteCoupon(couponId);
    return amount;
  }
  //포인트 적립 -> 들어온 최종가격의 10%를 적립해준다
  async createPoint(pointDto: reqPointOrderDto) {
    const point = pointDto.amount / 10;
    const userId = pointDto.userId;
    const dto = { userId, point };
    return this.pointRepository.createPoint(dto);
  }
  async getPoint(userId: number) {
    return this.pointRepository.getUserPoint(userId);
  }

  async applyPoint(pointDto: reqPointOrderDto) {
    if (pointDto.amount < 5000) {
      throw new HttpException(
        '5000원 이상부터 쿠폰 사용이 가능합니다',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const userId = pointDto.userId;
      const point = pointDto.point;
      const dto = { userId, point };
      const checkPoint = await this.pointRepository.deletePoint(dto);
      if (!checkPoint) {
        throw new HttpException(
          '사용할 포인트가 부족하거나 유저를 찾을 수 없습니다',
          HttpStatus.BAD_REQUEST,
        );
      }
      const newAmount = pointDto.amount - pointDto.point;
      return newAmount;
    }
  }
  async tossPayment(tosspaymentDto: TossPaymentDto) {
    const { orderId, amount, paymentKey} = tosspaymentDto;
    try {
      const response = await axios.post(
        `$(this.tossurl)/$(paymentKey)`,
        { orderId, amount },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`$(this.secretkey}:`).toString('base64')} `,
            'Content-Type': 'application/json',
          },
        },
      );
      return {
        title: '성공',
        body: response.data,
      };
    } catch (error) {
      throw new HttpException('결제시에 문제가 발생했습니다', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
