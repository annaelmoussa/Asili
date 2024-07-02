export interface ISubscription {
  id?: string;
  userId: string;
  stripeSubscriptionId: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
}
