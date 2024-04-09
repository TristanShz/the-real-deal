import { Injectable } from '@nestjs/common';
import { IdProvider } from '../application/id-provider';
import { v4 } from 'uuid';

@Injectable()
export class RealIdProvider implements IdProvider {
  provide() {
    return v4();
  }
}
