import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenDTO {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  token: string;
}
