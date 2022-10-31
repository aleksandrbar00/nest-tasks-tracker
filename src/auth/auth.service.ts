import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CryptoHelpers } from '../helpers/crypto-helpers';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async confirmAccount(token: string) {
    return this.usersService.confirmUser(token);
  }

  async validateUser(username: string, password: string) {
    try {
      const user = await this.usersService.getUsernameUser(username);

      if (!user) return null;

      if (await CryptoHelpers.compareHash(password, user.password)) {
        return user;
      }
    } catch (e) {
      return null;
    }
  }

  async login(user: UserEntity) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
