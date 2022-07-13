import { User } from '../../user/entity/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'auth_tokens' })
export class Token {
  @Column({ nullable: false, primary: true })
  id!: string;

  @Column({ nullable: false, default: false })
  revoked!: boolean;

  @ManyToOne(() => User)
  user: User;

  @Column({ nullable: false, unique: true })
  expiredAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
