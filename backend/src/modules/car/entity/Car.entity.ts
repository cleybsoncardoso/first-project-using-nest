import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'cars' })
export class Car {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  @ApiProperty()
  id: number;

  @Column({ nullable: false })
  @ApiProperty()
  name!: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt!: Date;

  @DeleteDateColumn()
  @ApiProperty()
  deletedAt?: Date | null;
}
