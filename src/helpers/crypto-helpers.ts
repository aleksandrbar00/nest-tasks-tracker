import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class CryptoHelpers {
  static async getSalt() {
    return bcrypt.genSalt();
  }

  static async getHash(data: string, salt: string) {
    return bcrypt.hash(data, salt);
  }

  static async compareHash(data: string, hash: string) {
    return bcrypt.compare(data, hash);
  }

  static getRandomUUID() {
    return uuidv4();
  }
}
