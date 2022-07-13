import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCarDTO {
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
