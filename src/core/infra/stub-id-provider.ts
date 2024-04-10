import { IdProvider } from '../application/ports/id-provider';

export class StubIdProvider implements IdProvider {
  id = 'stub-id';
  generate() {
    return this.id;
  }
}
