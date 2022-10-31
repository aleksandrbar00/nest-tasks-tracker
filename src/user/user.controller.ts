import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getIdUser(@Param('id') id: string, @Request() req) {
    if (req.user.id !== +id) throw new UnauthorizedException();

    return this.userService.getIdUser(+id);
  }
}
