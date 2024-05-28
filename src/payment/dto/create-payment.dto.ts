import { IsEnum } from 'class-validator';
export class CreatePaymentDto {
  userId: number;
  @IsEnum(['percent', 'fixed'])
  type: 'percent' | 'fixed';

  discount: number;

  expirationDate: Date;

  coouponId: number;
}
