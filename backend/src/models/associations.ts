import Order, { associateOrder } from './Order';
import OrderItem, { associateOrderItem } from './OrderItem';
import User from './User';
import Product from './Product';

export const setupAssociations = () => {
  const models = {
    Order,
    OrderItem,
    User,
    Product
  };

  associateOrder(models);
  associateOrderItem(models);
};