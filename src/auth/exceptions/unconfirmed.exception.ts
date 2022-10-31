import { HttpException, HttpStatus } from '@nestjs/common';

export class UnconfirmedException extends HttpException {
  constructor() {
    super('Unconfirmed account', HttpStatus.UNAUTHORIZED);
  }
}
