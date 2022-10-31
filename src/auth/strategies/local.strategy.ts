import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

const PASSWORD_FIELD = 'password';
const USERNAME_FIELD = 'username';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: USERNAME_FIELD,
      passwordField: PASSWORD_FIELD,
    });
  }

  async validate(username: string, password: string) {
    const user = this.authService.validateUser(username, password);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
