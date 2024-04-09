import { Entity } from '../common/entity';

export interface UserProps {
  id: string;
  username: string;
  email: string;
  password: string;
  balance: number;
}

export class User extends Entity<UserProps, string> {
  constructor(props: UserProps) {
    super(props);
  }

  get balance() {
    return this._props.balance;
  }

  get data() {
    return {
      id: this._props.id,
      username: this._props.username,
      email: this._props.email,
      password: this._props.password,
      balance: this._props.balance,
    };
  }

  static fromData(data: User['data']) {
    return new User(data);
  }
}
