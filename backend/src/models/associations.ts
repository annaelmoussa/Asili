import Order, { associateOrder } from './Order';
import OrderItem, { associateOrderItem } from './OrderItem';
import User from './User';
import Product from './Product';

/**
 * TODO Lotfi : faire une méthode générique associate
 */
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