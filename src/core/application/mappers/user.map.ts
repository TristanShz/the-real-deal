import { User } from 'src/core/domain/user';

export class UserMap {
  static toDomain(raw: any): User {
    return User.fromData({
      id: raw.id,
      email: raw.email,
      username: raw.username,
      role: raw.role,
      balance: raw.balance,
    });
  }

  static toPersistence(user: User) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      balance: user.balance,
    };
  }
}
