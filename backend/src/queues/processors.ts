import { reservationExpirationQueue, stockReleaseQueue } from "./index";
import CartItem from "../models/CartItem";
import Product from "../models/Product";
import db from "../models";

reservationExpirationQueue.process(async (job) => {
  const { cartItemId, quantity } = job.data;

  await db.sequelize.transaction(async (t) => {
    const cartItem = await CartItem.findByPk(cartItemId, {
      transaction: t,
      include: [{ model: Product }],
    });
    if (cartItem) {
      const product = await Product.findByPk(cartItem.productId, {
        transaction: t,
        lock: true,
      });
      if (product) {
        product.stock += quantity; // Only release the reserved quantity
        await product.save({ transaction: t });
      }
      await cartItem.destroy({ transaction: t });
    }
  });
});

stockReleaseQueue.process(async (job) => {
  const { productId, quantity } = job.data;

  await db.sequelize.transaction(async (t) => {
    const product = await Product.findByPk(productId, {
      transaction: t,
      lock: true,
    });
    if (product) {
      product.stock += quantity;
      await product.save({ transaction: t });
    }
  });
});
