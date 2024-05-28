import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Coupon } from './coupon.entity';
@Entity()
export class newCoupon {
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
  point: number;

  @Column({ type: 'timestamp' })
  expirationDate: Date;

  @OneToMany(() => Coupon, (coupon) => coupon.coupon)
  coupon: Coupon;
}
