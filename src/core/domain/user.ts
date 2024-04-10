import { z } from 'zod';
import { AggregateRoot } from '../common/aggregate-root';
import { EntityValidationError } from '../common/errors';

const UserPropsSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  balance: z.number().optional(),
});

export type UserProps = z.infer<typeof UserPropsSchema>;

export const UserPasswordSchema = z.string().min(8);

export class InvalidPasswordError extends Error {
  constructor() {
    super('Invalid password');
  }
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  balance?: number;
}

export class User extends AggregateRoot<UserProps, string> {
  constructor(props: UserProps) {
    super(props);

    this.validateProps(props);
  }

  get balance() {
    return this._props.balance || 0;
  }

  get data(): UserData {
    return {
      id: this._props.id,
      username: this._props.username,
      email: this._props.email,
      balance: this._props.balance,
    };
  }

  static fromData(data: UserData) {
    return new User(data);
  }

  static validatePassword(password: string) {
    const result = UserPasswordSchema.safeParse(password);
    if (!result.success) {
      throw new InvalidPasswordError();
    }
  }

  private validateProps(props: UserProps) {
    const result = UserPropsSchema.safeParse(props);

    if (!result.success) {
      throw new EntityValidationError(result.error.errors);
    }
  }
}
