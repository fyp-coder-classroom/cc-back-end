export interface IUser {
  id: string;
  role: UserRole; 
  name: string;
  email: string;
  password: string;
}

export type UserRole = 'teacher' | 'student';

export interface IToken {
  userId: string;
  token: string;
  type: 'access' | 'refresh';
}