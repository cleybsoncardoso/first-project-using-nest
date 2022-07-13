import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { User } from './entity/user.entity';
import { LoginDTO } from './dto/Login.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { TokenResponse } from '../auth/interfaces/TokenResponse';
import { TokenDTO } from './dto/Token.dto';
import { RefreshToken } from '../auth/entity/refreshToken.entity';
import { Token } from '../auth/entity/token.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly authService: AuthService,
  ) {}

  create(userDTO: CreateUserDTO): Promise<User> {
    const newUser = Object.assign(new User(), userDTO);
    return this.userRepository.save(newUser);
  }

  async login(data: LoginDTO): Promise<TokenResponse> {
    const user = await this.findByUsername(data.username);
    const match = await this.checkPassword(data.password, user);
    if (!match) {
      throw new NotFoundException('username or password are wrong');
    }
    return this.authService.createAccessToken(user);
  }

  async logoff(authorization: string) {
    const [, jwtToken] = authorization.split(' ');
    const tokenDecoded = this.authService.decodeJWT(jwtToken);
    const token = await this.tokenRepository.findOne({
      where: { id: tokenDecoded.jti, revoked: false },
    });
    if (!token) {
      throw new UnauthorizedException();
    }
    await this.authService.revokeToken(token);
  }

  async refreshToken(data: TokenDTO) {
    const refreshTokenDecoded = this.authService.decodeJWT(data.token);
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { id: refreshTokenDecoded.jti, revoked: false },
      relations: ['authToken.user'],
    });
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    await this.authService.revokeToken(refreshToken.authToken);
    return this.authService.createAccessToken(refreshToken.authToken.user);
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('Username not found');
    }
    return user;
  }

  private async checkPassword(password: string, user: User) {
    return bcrypt.compareSync(password, user.password);
  }
}
