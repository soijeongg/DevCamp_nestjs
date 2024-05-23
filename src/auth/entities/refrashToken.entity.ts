import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { user } from '../../user/entities';

@Entity()
export class RefrashToken {
  @PrimaryGeneratedColumn()
  RTokenId: number;

  @Column()
  jti: string;

  @Column('timestamp')
  expiresAt: Date;

  @Column('text')
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isRevoked: boolean;

  @ManyToOne(() => user, (user) => user.AccessToken)
  user: user;
}
