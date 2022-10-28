import * as bcrypt from 'bcrypt';

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
}
