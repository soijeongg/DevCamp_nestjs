import { user } from '../../user/entities';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { newCoupon } from './newCooupon.entity';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  couponId: number;

  @Column({
    type: 'enum',
    enum: ['percent', 'fixed'],
    default: 'percent',
  })
  type: 'percent' | 'fixed';

  @Column({ nullable: true })
  discount: number;

  @Column({ nullable: true })
  percent: number;

  @Column({ type: 'timestamp' })
  expirationDate: Date;

  @ManyToOne(() => user, (user) => user.coupon)
  user: user;

  @ManyToOne(() => newCoupon, (newCoupon) => newCoupon.coupon)
  coupon: newCoupon;
}
