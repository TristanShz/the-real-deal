import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IdProvider {
  abstract generate(): string;
}
