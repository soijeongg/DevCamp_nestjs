import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { user } from 'src/user/entities';
@Entity()
export class Point {
  @PrimaryGeneratedColumn()
  pointId: number;

  @Column()
  availableAmount: number;

  @Column()
  point: number;

  @OneToOne(() => user)
  @JoinColumn()
  user: user;
}
