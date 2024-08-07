export interface IUser {
  id?: string;
  email: string;
  password: string;
  role: string;
  isConfirmed?: boolean;
  confirmationToken?: string;
  stripeCustomerId?: string;
  scopes?: string[];
  lastPasswordChange?: Date;
  isDeleted?: boolean;
}
