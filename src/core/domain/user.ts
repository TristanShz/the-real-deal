import { Entity } from '../common/entity';

export interface UserProps {
  id: number;
  balance: number;
}

export class User extends Entity<UserProps, number> {
  constructor(props: UserProps) {
    super(props);
  }

  get balance() {
    return this._props.balance;
  }
}
