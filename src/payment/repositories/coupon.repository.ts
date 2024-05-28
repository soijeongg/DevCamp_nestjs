import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Coupon } from '../entities/coupon.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { user } from 'src/user/entities';
import { newCoupon } from '../entities';

@Injectable()
export class CouponRepository {
  constructor(private readonly entityManager: EntityManager) {}

  // 쿠폰 생성, 둘 다 DTO로 받는다
  async createCoupon(createPaymentDto: CreatePaymentDto): Promise<Coupon> {
    const coupon = new Coupon();
    // 먼저 유저 아이디로 유저를 찾는다
    const findUser = await this.entityManager.findOne(user, {
      where: { userId: createPaymentDto.userId },
    });
    if (!findUser) {
      throw new Error('유저를 찾지 못했습니다 ');
    }
    const findCoupon = await this.entityManager.findOne(newCoupon, {
      where: { couponId: createPaymentDto.coouponId },
    });
    if (!findCoupon) {
      throw new Error('쿠폰을 찾을 수 없습니다');
    }
    // 페센트일 때 정률제, point에 몇 프로 할인할 것인지 적기
    if (createPaymentDto.type === 'percent') {
      coupon.type = createPaymentDto.type;
      coupon.percent = createPaymentDto.discount;
      coupon.expirationDate = createPaymentDto.expirationDate;
      coupon.user = findUser;
      coupon.coupon = findCoupon;
    } else if (createPaymentDto.type === 'fixed') {
      coupon.type = createPaymentDto.type;
      coupon.discount = createPaymentDto.discount;
      coupon.expirationDate = createPaymentDto.expirationDate;
      coupon.user = findUser;
      coupon.coupon = findCoupon;
    }
    return this.entityManager.save(Coupon, coupon);
  }

  // 사용했으면 삭제하기, 사용한 쿠폰 아이디를 받아 삭제한다
  async deleteCoupon(couponId: number): Promise<void> {
    await this.entityManager.delete(Coupon, couponId);
  }

  // 쿠폰 아이디로 쿠폰 찾기
  async findCoupon(couponId: number): Promise<Coupon> {
    return await this.entityManager.findOne(Coupon, { where: { couponId } });
  }

  // 내가 가진 쿠폰을 전체 보여주기
  async findAllCoupon(userId: number): Promise<Coupon[]> {
    const findUser = await this.entityManager.findOne(user, {
      where: { userId },
    });
    if (!findUser) {
      throw new Error('User not found');
    }

    return await this.entityManager.find(Coupon, { where: { user: findUser } });
  }
  async findCouponForUser(userId: number, couponId: number): Promise<Coupon> {
    return this.entityManager.findOne(Coupon, {
      where: { couponId, user: { userId } },
    });
  }
}
