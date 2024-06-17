export interface IUser {
  id?: string;
  email: string;
  password: string;
  role: string;
  isConfirmed?: boolean;
  token?: string;
  confirmationToken?: string;
}
