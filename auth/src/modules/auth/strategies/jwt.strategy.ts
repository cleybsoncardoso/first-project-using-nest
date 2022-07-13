import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Token } from '../entity/token.entity';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpired: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    if (payload.data) {
      const token = await this.tokenRepository.findOne({
        where: { id: payload.jti, revoked: false },
        relations: ['user'],
      });
      return token?.user;
    }
    return null;
  }
}
