import * as bcrypt from 'bcrypt';
import { PasswordHelper } from '../application/ports/password-helper';

export class RealPasswordHelper implements PasswordHelper {
  hash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  compare(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
