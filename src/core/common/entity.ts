import { Equatable } from './equatable';

export abstract class Entity<T extends { id: U }, U = string | number>
  implements Equatable<Entity<T, U>>
{
  protected constructor(protected _props: T) {}

  get id(): U {
    return this._props.id;
  }

  equals(obj: Entity<T, U>): boolean {
    return !!obj && this._props.id === obj._props.id;
  }
}
