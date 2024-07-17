export interface IUser {
  id?: string;
  email: string;
  password: string;
  role: string;
  isConfirmed?: boolean;
  confirmationToken?: string;
  stripeCustomerId?: string;
  scopes?: string[];
  isDeleted?: boolean;
  lastPasswordChange?: Date;
}
