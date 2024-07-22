import mongoose from "mongoose";

const MongoOrderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    stripeInvoiceId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true, index: true },
    shippingAddress: String,
    trackingNumber: String,
    createdAt: { type: Date, required: true, index: true },
    updatedAt: { type: Date, required: true },
    items: [
      {
        id: String,
        productId: { type: String, index: true },
        productName: String,
        productDescription: String,
        quantity: Number,
        priceAtPurchase: Number,
        productImage: String,
      },
    ],
    shipping: {
      id: String,
      address: String,
      status: String,
    },
    payment: {
      id: String,
      stripePaymentId: String,
      amount: Number,
      status: String,
    },
  },
  { timestamps: true }
);

// Ajout d'index composites pour des requêtes courantes
MongoOrderSchema.index({ userId: 1, createdAt: -1 });
MongoOrderSchema.index({ status: 1, createdAt: -1 });

// Index pour la recherche full-text si nécessaire
MongoOrderSchema.index({
  "items.productName": "text",
  "items.productDescription": "text",
});

export const MongoOrder = mongoose.model("Order", MongoOrderSchema);
