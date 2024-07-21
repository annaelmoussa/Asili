import mongoose from 'mongoose';

const MongoOrderSchema = new mongoose.Schema({
  id: String,
  userId: String,
  stripeInvoiceId: String,
  amount: Number,
  status: String,
  shippingAddress: String,
  trackingNumber: String,
  createdAt: Date,
  updatedAt: Date,
  items: [{
    id: String,
    productId: String,
    productName: String,
    quantity: Number,
    priceAtPurchase: Number
  }],
  shipping: {
    id: String,
    address: String,
    status: String
  },
  payment: {
    id: String,
    stripePaymentId: String,
    amount: Number,
    status: String
  }
});

export const MongoOrder = mongoose.model('Order', MongoOrderSchema);