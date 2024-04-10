import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class PasswordHelper {
  abstract hash(password: string): string;
  abstract compare(password: string, hash: string): boolean;
}
