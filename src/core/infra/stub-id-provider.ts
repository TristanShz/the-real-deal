import { IdProvider } from '../application/ports/id-provider';

export class StubIdProvider implements IdProvider {
  id = 'stub-id';
  provide() {
    return this.id;
  }
}
