import {
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('/confirm')
  async confirm(@Query('token') token: string) {
    return this.authService.confirmAccount(token);
  }

  @Get('/logout')
  async logout() {
    /**/
  }
}
