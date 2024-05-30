import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AccessToken, RefrashToken } from '../../auth/entities/index';
import { Coupon, Point } from '../../payment/entities/index';

@Entity()
export class user {
  @PrimaryGeneratedColumn()
  userId!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @OneToMany(() => AccessToken, (AccessToken) => AccessToken.user)
  AccessToken: AccessToken[];

  @OneToMany(() => RefrashToken, (RefrashToken) => RefrashToken.user)
  RefashToken: RefrashToken[];

  @OneToMany(() => Coupon, (Coupon) => Coupon.user)
  coupon: Coupon;

  @OneToOne(() => Point, (Point) => Point.user)
  point: Point;
}
//한개의  유저는 여러개의 포스트를 작성할 수 있고 여러게의 포스트는 한명의 유저를 가질 수 있다
//한개의 유저는 여러개의 댓글을 작성할 수 있고 여러 댓글을 한 유저를 가진다
