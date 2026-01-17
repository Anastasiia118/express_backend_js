import { PaginationAndSorting } from '../types/common_types';
export type CreateUserDto = {
  login: string;
  password: string;
  email: string;
};
export interface UserDBType {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}
export interface IUserService {
    id: string,
    login: string,
    email: string,
    passwordHash: string,
    createdAt: Date,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
}
export interface UserOutputType {
    id: string;
    login: string;
    email: string;
    createdAt: string;
}

export type UsersQueryFieldsType = {
  searchLoginTerm?: string;
  searchEmailTerm?: string;
} & PaginationAndSorting<'login' | 'email' | 'createdAt'>;
