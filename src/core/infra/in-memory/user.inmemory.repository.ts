import { UserRepository } from 'src/core/application/ports/user.repository';
import { User } from 'src/core/domain/user';

export class InMemoryUserRepository implements UserRepository {
  users: User[] = [];
  passwords: Map<string, string> = new Map();

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async register(user: User, password: string): Promise<void> {
    this.users.push(user);
    this.passwords.set(user.id, password);
  }
  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  givenSomeUsersExist(users: User[]) {
    this.users = users;
  }
}
