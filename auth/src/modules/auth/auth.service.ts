import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Token } from './entity/token.entity';
import { sign, decode, JwtPayload } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { TokenResponse } from './interfaces/TokenResponse';
import { RefreshToken } from './entity/refreshToken.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  public async createAccessToken(user: User): Promise<TokenResponse> {
    const uuid = bcrypt.hashSync(Date.now().toString(16), 10);
    const uuidRefresh = bcrypt.hashSync(
      Date.now().toString(16) + 'refresh',
      10,
    );
    const accessToken = sign(
      {
        data: {
          id: user.id,
          username: user.username,
        },
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE_TIME,
        jwtid: uuid,
      },
    );
    const refreshToken = sign(
      {
        data: {
          id: user.id,
          username: user.username,
        },
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE_REFRESH_TIME,
        jwtid: uuidRefresh,
      },
    );
    const decoded = this.decodeJWT(accessToken);
    const refreshDecoded = this.decodeJWT(refreshToken);
    const expiredAt = new Date(decoded.exp * 1000);
    const refreshExpiredAt = new Date(refreshDecoded.exp * 1000);
    const token = await this.tokenRepository.save({
      id: uuid,
      revoked: false,
      expiredAt: expiredAt,
      user: user,
    });
    await this.refreshTokenRepository.save({
      id: uuidRefresh,
      expiredAt: refreshExpiredAt,
      authToken: token,
    });
    return {
      accessToken,
      expiredAt,
      refreshToken: refreshToken,
      type: 'Bearer',
    };
  }

  public async revokeToken(token: Token) {
    await this.tokenRepository.update({ id: token.id }, { revoked: true });
    await this.refreshTokenRepository.update(
      { authTokenId: token.id },
      { revoked: true },
    );
  }

  public decodeJWT(jwt: string): null | JwtPayload {
    return decode(jwt, { json: true });
  }
}
