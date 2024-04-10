import { PasswordHelper } from '../application/ports/password-helper';

export class StubPasswordHelper implements PasswordHelper {
  hashPrefix = 'hashed-';

  hash(password: string): string {
    return this.hashPrefix + password;
  }

  compare(password: string, hash: string): boolean {
    return hash === this.hashPrefix + password;
  }
}
