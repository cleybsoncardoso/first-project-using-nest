import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenResponse } from '../auth/interfaces/TokenResponse';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { LoginDTO } from './dto/Login.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TokenDTO } from './dto/Token.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDTO })
  @ApiOkResponse({ type: User })
  async store(@Body() userDTO: CreateUserDTO): Promise<User> {
    return this.userService.create({ ...userDTO });
  }

  @Post('login')
  @ApiBody({ type: LoginDTO })
  async login(@Body() data: LoginDTO): Promise<TokenResponse> {
    return this.userService.login(data);
  }

  @Post('refreshtoken')
  @ApiBody({ type: LoginDTO })
  async refreshToken(@Body() data: TokenDTO) {
    return this.userService.refreshToken(data);
  }

  @Get('logoff')
  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  public logoff(@Request() request) {
    return this.userService.logoff(request.headers.authorization);
  }

  @Get('checktoken')
  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: User })
  public data(@Request() request): Promise<User> {
    return request.user;
  }
}
