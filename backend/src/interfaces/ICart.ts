import {ICartItem} from "../interfaces/ICartItem";

export interface ICart {
  id?: string;
  userId: string;
  items?: ICartItem[];
}
