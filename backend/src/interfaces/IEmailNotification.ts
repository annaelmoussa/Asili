export interface IEmailNotification {
    id?: string;
    userId: string;
    type: string;
    productId?: string;
    categoryId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  