export interface ISentEmail {
    id?: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
    sentAt?: Date;
  }