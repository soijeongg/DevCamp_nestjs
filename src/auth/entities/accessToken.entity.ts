import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { user } from '../../user/entities';

@Entity()
export class AccessToken {
  @PrimaryGeneratedColumn()
  ATokenId: number;

  @Column('timestamp')
  expiresAt: Date;

  @Column('text')
  token: string;

  @Column('timestamp')
  createAt: Date;

  @ManyToOne(() => user, (user) => user.AccessToken)
  user: user;
}
