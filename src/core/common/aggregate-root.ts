import { Entity } from './entity';

export abstract class AggregateRoot<
  T extends { id: U },
  U = string | number,
> extends Entity<T, U> {}
