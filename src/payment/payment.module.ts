import { Module } from '@nestjs/common';
import { PaymentService } from './service/payment.service';
import { PaymentController } from './controller/payment.controller';
import { CouponRepository, PointRepository } from './repositories';
import { UserRepository } from 'src/user/repositories/user.respository';

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    CouponRepository,
    PointRepository,
    UserRepository,
  ],
  exports: [PointRepository, CouponRepository, UserRepository],
})
export class PaymentModule {}
