import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { CryptoHelpers } from '../helpers/crypto-helpers';
import { MailingService } from '../mailing/mailing.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private mailingService: MailingService,
  ) {}

  async createUser(payload: CreateUserDto) {
    try {
      const user = new UserEntity();
      user.salt = await CryptoHelpers.getSalt();
      user.password = await CryptoHelpers.getHash(payload.password, user.salt);
      user.email = payload.email;
      user.username = payload.username;
      user.confirmationToken = CryptoHelpers.getRandomUUID();
      user.isConfirmed = false;
      const saved = await this.usersRepository.save(user);
      await this.mailingService.sendConfirmationMail(
        user.email,
        'http://localhost:3000/auth/confirm?token=' + user.confirmationToken,
        user.username,
      );
      return saved;
    } catch (e) {
      console.log(e);
    }
  }

  async confirmUser(token: string) {
    const user = await this.usersRepository.findOneBy({
      confirmationToken: token,
    });

    if (!user) {
      return null;
    }

    user.isConfirmed = true;
    user.confirmationToken = null;

    return this.usersRepository.save(user);
  }

  async getIdUser(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async getUsernameUser(username: string) {
    return this.usersRepository.findOneBy({ username });
  }
}
