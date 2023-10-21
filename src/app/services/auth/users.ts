import { Roles } from 'app/models/roles';

export interface IUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  phoneNumber: string;
  age: number;
  role?: Roles;
}
