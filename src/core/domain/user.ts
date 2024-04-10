import { z } from 'zod';
import { AggregateRoot } from '../common/aggregate-root';
import { EntityValidationError } from '../common/errors';

export const USER_ROLES = ['MEMBER', 'BOOKMAKER'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export class InsufficientBalanceError extends Error {
  constructor() {
    super('Insufficient balance');
  }
}

const UserPropsSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  role: z.enum(USER_ROLES),
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
  role: UserRole;
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

  get role() {
    return this._props.role;
  }

  get data(): UserData {
    return {
      id: this._props.id,
      username: this._props.username,
      email: this._props.email,
      role: this._props.role,
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

  deposit(amount: number) {
    this._props.balance = this.balance + amount;
  }

  debit(amount: number) {
    if (this.balance < amount) {
      throw new InsufficientBalanceError();
    }

    this._props.balance = this.balance - amount;
  }

  private validateProps(props: UserProps) {
    const result = UserPropsSchema.safeParse(props);

    if (!result.success) {
      throw new EntityValidationError(result.error.errors);
    }
  }
}
