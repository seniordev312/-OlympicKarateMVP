export type User = {
  id?: string;
  email?: string;
  username: string;
  password?: string;
  token?: string;
};

export type UserInput = Omit<User, 'id'>;
