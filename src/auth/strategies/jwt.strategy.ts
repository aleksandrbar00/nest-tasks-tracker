import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConsts } from '../consts';
import { UserService } from '../../user/user.service';
import { UnconfirmedException } from '../exceptions/unconfirmed.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConsts.secret,
    });
  }

  async validate(payload: { sub: number }) {
    const user = await this.usersService.getIdUser(payload.sub);

    if (!user) throw new UnauthorizedException();

    if (!user.isConfirmed) throw new UnconfirmedException();

    return {
      id: user.id,
      username: user.username,
    };
  }
}
