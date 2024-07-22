import Order, { associateOrder } from './Order';
import OrderItem, { associateOrderItem } from './OrderItem';
import User from './User';
import Shipping, { associateShipping } from './Shipping';
import Payment, { associatePayment } from './Payment';
import Product from './Product';

/**
 * TODO Lotfi : faire une méthode générique associate
 */
export const setupAssociations = () => {
  const models = {
    Order,
    OrderItem,
    User,
    Product,
    Shipping,
    Payment
  };

  associateOrder(models);
  associateOrderItem(models);
  associateShipping(models);
  associatePayment(models);
};