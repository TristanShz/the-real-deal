import { Injectable } from '@nestjs/common';
import { User } from 'src/core/domain/user';

@Injectable()
export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract findById(id: string): Promise<User | undefined>;
}
