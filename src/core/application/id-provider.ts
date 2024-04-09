import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IdProvider {
  abstract provide(): string;
}
