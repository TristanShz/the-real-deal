export interface PasswordHelper {
  hash(password: string): string;
  decode(password: string): string;
}
