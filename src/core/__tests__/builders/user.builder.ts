import { User, UserRole } from '../../domain/user';

export const userBuilder = ({
  id = 'stub-id',
  username = 'john doe',
  email = 'johndoe@gmail.com',
  password = 'password',
  role = 'MEMBER',
  balance = 100,
}: {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  balance?: number;
} = {}) => {
  const props = { id, username, email, password, role, balance };

  return {
    withId(id: string) {
      return userBuilder({ ...props, id });
    },
    withUsername(username: string) {
      return userBuilder({ ...props, username });
    },
    withEmail(email: string) {
      return userBuilder({ ...props, email });
    },
    withPassword(password: string) {
      return userBuilder({ ...props, password });
    },
    withBalance(balance: number) {
      return userBuilder({ ...props, balance });
    },
    asBookmaker() {
      return userBuilder({ ...props, role: 'BOOKMAKER' });
    },
    asMember() {
      return userBuilder({ ...props, role: 'MEMBER' });
    },
    build() {
      return User.fromData(props);
    },
  };
};
