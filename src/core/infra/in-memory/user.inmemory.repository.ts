import { UserRepository } from 'src/core/application/user.repository';
import { User } from 'src/core/domain/user';

export class InMemoryUserRepository implements UserRepository {
  users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  givenSomeUsersExist(users: User[]) {
    this.users = users;
  }
}
