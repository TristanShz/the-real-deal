import { Injectable } from '@nestjs/common';
import { IdProvider } from '../application/ports/id-provider';
import { v4 } from 'uuid';

@Injectable()
export class RealIdProvider implements IdProvider {
  generate() {
    return v4();
  }
}
