import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Token } from './token.entity';

@Entity({ name: 'auth_refresh_tokens' })
export class RefreshToken {
  @Column({ nullable: false, primary: true })
  id!: string;

  @OneToOne(() => Token)
  @JoinColumn({ name: 'authTokenId' })
  authToken: Token;

  @Column({ nullable: false, default: false })
  revoked!: boolean;

  @Column({ nullable: false })
  authTokenId!: string;

  @Column({ nullable: false, unique: true })
  expiredAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
