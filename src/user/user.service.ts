import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { CryptoHelpers } from '../helpers/crypto-helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(payload: CreateUserDto) {
    try {
      const user = new UserEntity();
      user.salt = await CryptoHelpers.getSalt();
      user.password = await CryptoHelpers.getHash(payload.password, user.salt);
      user.email = payload.email;
      user.username = payload.username;
      user.isConfirmed = false;
      return await this.usersRepository.save(user);
    } catch (e) {
      console.log(e);
    }
  }

  async getIdUser(id: number) {
    return this.usersRepository.findOneBy({ id });
  }
}
