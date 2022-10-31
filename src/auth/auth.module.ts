import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { jwtConsts } from './consts';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConsts.secret,
      signOptions: { expiresIn: 1000 * 60 * 15 },
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
