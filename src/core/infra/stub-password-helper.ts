import { PasswordHelper } from '../application/ports/password-helper';

export class StubPasswordHelper implements PasswordHelper {
  hashPrefix = 'hashed-';

  hash(password: string): string {
    return this.hashPrefix + password;
  }

  decode(password: string): string {
    return password.replace(this.hashPrefix, '');
  }
}
