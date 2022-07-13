import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  name!: string;

  @ApiProperty()
  @Column({ nullable: false, unique: true })
  username!: string;

  @Column({ nullable: false })
  password!: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  updateDates() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
