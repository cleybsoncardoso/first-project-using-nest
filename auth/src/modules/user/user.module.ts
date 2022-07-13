import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RefreshToken } from '../auth/entity/refreshToken.entity';
import { Token } from '../auth/entity/token.entity';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken, Token]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
