import { Injectable } from '@nestjs/common';
import { User } from 'src/core/domain/user';

@Injectable()
export abstract class UserRepository {
  abstract findById(id: string): Promise<User | undefined>;
  abstract register(user: User, password: string): Promise<void>;
}
